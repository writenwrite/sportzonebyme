import { Router } from 'express';
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  toggleWishlist,
  getWishlist,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.post('/wishlist/:productId', toggleWishlist);
router.get('/wishlist', getWishlist);

export default router;
