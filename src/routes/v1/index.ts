import { Router } from 'express';

import bookingSystem from './bookingSystem';
import orders from './orders';

const router = Router();

router.use('/orders', orders);
router.use('/booking-system', bookingSystem);

export default router;
