import { Router, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

router.post('/create-payment-intent', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError('Order ID is required', 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== req.user?.id) {
      throw new AppError('Unauthorized', 403);
    }

    if (order.paymentIntentId) {
      // Already has a payment intent, retrieve it
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        if (existingIntent.status === 'requires_payment_method' || existingIntent.status === 'requires_confirmation') {
          return res.json({
            status: 'success',
            data: {
              clientSecret: existingIntent.client_secret,
              paymentIntentId: existingIntent.id,
            },
          });
        }
      } catch (e) {
        // Intent might be invalid, create a new one
      }
    }

    // Create new PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'PENDING',
      },
    });

    res.json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    throw error;
  }
});

export default router;
