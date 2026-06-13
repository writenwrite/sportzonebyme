import { Router } from 'express';
import {
  getReviewsByProduct,
  createReview,
  deleteReview,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/product/:productId', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
