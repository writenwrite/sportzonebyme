import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { name, phone, avatar },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
      },
    });

    res.json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { label, street, city, state, postalCode, country, phone, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user?.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user?.id!,
        label,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault,
      },
    });

    res.status(201).json({ status: 'success', data: { address } });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { label, street, city, state, postalCode, country, phone, isDefault } = req.body;

    const address = await prisma.address.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user?.id },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { label, street, city, state, postalCode, country, phone, isDefault },
    });

    res.json({ status: 'success', data: { address: updatedAddress } });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findFirst({
      where: { id, userId: req.user?.id },
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.delete({ where: { id } });

    res.json({ status: 'success', message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user?.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json({ status: 'success', data: { addresses } });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user?.id!,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      res.json({ status: 'success', message: 'Removed from wishlist' });
    } else {
      await prisma.wishlist.create({
        data: {
          userId: req.user?.id!,
          productId,
        },
      });
      res.json({ status: 'success', message: 'Added to wishlist' });
    }
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user?.id },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ status: 'success', data: { wishlist } });
  } catch (error) {
    next(error);
  }
};
