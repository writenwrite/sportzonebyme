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

    const updatedCart = await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: { userId: req.user?.id },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId: req.user?.id! },
        });
      }

      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      });

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId,
            quantity,
            price,
          },
        });
      }

      const cartWithItems = await tx.cart.findUnique({
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

      const total = cartWithItems!.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await tx.cart.update({
        where: { id: cart.id },
        data: { total },
      });

      return { ...cartWithItems, total };
    });

    res.json({
      status: 'success',
      data: { cart: updatedCart },
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

    const updatedCart = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: req.user?.id },
      });

      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      const cartItem = await tx.cartItem.findFirst({
        where: { id: itemId, cartId: cart.id },
      });

      if (!cartItem) {
        throw new AppError('Cart item not found', 404);
      }

      if (quantity <= 0) {
        await tx.cartItem.delete({ where: { id: itemId } });
      } else {
        await tx.cartItem.update({
          where: { id: itemId },
          data: { quantity },
        });
      }

      const cartWithItems = await tx.cart.findUnique({
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

      const total = cartWithItems!.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await tx.cart.update({
        where: { id: cart.id },
        data: { total },
      });

      return { ...cartWithItems, total };
    });

    res.json({
      status: 'success',
      data: { cart: updatedCart },
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

    const updatedCart = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: req.user?.id },
      });

      if (!cart) {
        throw new AppError('Cart not found', 404);
      }

      const cartItem = await tx.cartItem.findFirst({
        where: { id: itemId, cartId: cart.id },
      });

      if (!cartItem) {
        throw new AppError('Cart item not found', 404);
      }

      await tx.cartItem.delete({ where: { id: itemId } });

      const cartWithItems = await tx.cart.findUnique({
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

      const total = cartWithItems!.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await tx.cart.update({
        where: { id: cart.id },
        data: { total },
      });

      return { ...cartWithItems, total };
    });

    res.json({
      status: 'success',
      data: { cart: updatedCart },
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
