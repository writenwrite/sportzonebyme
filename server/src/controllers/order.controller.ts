import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateOrderNumber } from '../utils/helpers';
import {
  sendOrderConfirmation,
  sendShippingUpdate,
  sendDeliveryConfirmation,
} from '../services/whatsapp.service';

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shippingAddress, billingAddress, notes, shippingService, shippingCost } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.1;
    const total = subtotal + (shippingCost || 0) + tax;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user?.id!,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              image: item.product.images[0]?.url,
            })),
          },
          shippingAddress: JSON.stringify(shippingAddress),
          billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
          subtotal,
          shippingCost: shippingCost || 0,
          tax,
          total,
          notes,
          shippingService,
        },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
      });

      // Update stock atomically
      for (const item of cart.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { stock: true },
          });
          if (variant && variant.stock < item.quantity) {
            throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
          }
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true },
          });
          if (product && product.stock < item.quantity) {
            throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.update({
        where: { id: cart.id },
        data: { total: 0 },
      });

      return newOrder;
    });

    // Send WhatsApp notification (outside transaction)
    const userWithPhone = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { phone: true },
    });
    if (userWithPhone?.phone) {
      sendOrderConfirmation(
        userWithPhone.phone,
        order.orderNumber,
        total,
        order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    }

    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user?.id },
        include: {
          items: {
            include: {
              product: { select: { name: true, images: { take: 1 } } },
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId: req.user?.id } }),
    ]);

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: { take: 1 } } },
            variant: true,
          },
        },
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    res.json({ status: 'success', data: { order } });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
      },
    });

    // Send WhatsApp notification for shipping updates
    if (['SHIPPED', 'DELIVERED'].includes(status)) {
      const orderWithUser = await prisma.order.findUnique({
        where: { id },
        include: { user: { select: { phone: true } } },
      });
      if (orderWithUser?.user.phone) {
        if (status === 'DELIVERED') {
          sendDeliveryConfirmation(orderWithUser.user.phone, orderWithUser.orderNumber);
        } else {
          sendShippingUpdate(
            orderWithUser.user.phone,
            orderWithUser.orderNumber,
            status,
            trackingNumber,
            orderWithUser.shippingService || undefined
          );
        }
      }
    }

    res.json({ status: 'success', data: { order: updatedOrder } });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new AppError('Order cannot be cancelled', 400);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stock atomically
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    });

    res.json({ status: 'success', data: { order: updatedOrder } });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
