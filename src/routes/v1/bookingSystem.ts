import { Router } from 'express';

import { booking, cancel, getBookingInfo, getCancellationInfo } from '../../services/bookingSystem';

const router = Router();

router.post('/bookings', [], booking);
router.get('/bookings/:id', [], getBookingInfo);
router.post('/cancellations', [], cancel);
router.get('/cancellations/:id', [], getCancellationInfo);

export default router;
