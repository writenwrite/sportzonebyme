import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getReviewsByProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId } }),
      prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    // Rating distribution
    const distribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
      orderBy: { rating: 'desc' },
    });

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: distribution.find((d) => d.rating === rating)?._count.rating || 0,
    }));

    res.json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        stats: {
          average: stats._avg.rating || 0,
          total: stats._count.rating || 0,
          distribution: ratingDistribution,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.id;

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: userId!,
          productId,
        },
      },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 400);
    }

    // Check if user purchased this product (optional: for verified purchase badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        product: { id: productId },
        order: { userId: userId!, status: 'DELIVERED' },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: userId!,
        productId,
        rating,
        title,
        comment,
        images: JSON.stringify(images || []),
        isVerified: !!hasPurchased,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update product average rating
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating || 0,
      },
    });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId && req.user?.role !== 'ADMIN') {
      throw new AppError('Unauthorized', 403);
    }

    const productId = review.productId;

    await prisma.review.delete({ where: { id } });

    // Update product average rating
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating || 0,
      },
    });

    res.json({ status: 'success', message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
