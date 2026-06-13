import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({
        status: 'success',
        data: { cart: { items: [], total: 0 } },
      });
    }

    res.json({ status: 'success', data: { cart } });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const price = variantId
      ? product.variants.find((v) => v.id === variantId)?.price || product.price
      : product.price;

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user?.id! },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          price,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    const total = updatedCart!.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total },
    });

    res.json({
      status: 'success',
      data: { cart: { ...updatedCart, total } },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    const total = updatedCart!.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total },
    });

    res.json({
      status: 'success',
      data: { cart: { ...updatedCart, total } },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    const total = updatedCart!.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total },
    });

    res.json({
      status: 'success',
      data: { cart: { ...updatedCart, total } },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user?.id },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total: 0 },
    });

    res.json({ status: 'success', message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
