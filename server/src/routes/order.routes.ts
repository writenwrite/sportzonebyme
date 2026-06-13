import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/admin/all', authorize('ADMIN'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.put('/:id/status', authorize('ADMIN'), updateOrderStatus);

export default router;
