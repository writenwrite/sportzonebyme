import { Router } from 'express';
import { getShippingRates, trackShipment } from '../controllers/shipping.controller';

const router = Router();

router.post('/rates', getShippingRates);
router.get('/track/:carrier/:trackingNumber', trackShipment);

export default router;
