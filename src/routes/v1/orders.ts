import { Router } from 'express';

import { validatorCreate } from '../../middleware/validation/orders';
import { validatorBooking } from '../../middleware/validation/orders/validatorBooking';
import { validatorBookingConfirmation } from '../../middleware/validation/orders/validatorBookingConfirmation';
import { book, bookingConfirmation, create } from '../../services/orders';
import { get } from '../../services/orders/get';

const router = Router();

router.get('/:id([0-9]+)', [], get);
router.post('/', [validatorCreate], create);
router.post('/:id([0-9]+)/bookings', [validatorBooking], book);
router.post('/:id([0-9]+)/bookings/:bid/confirmation', [validatorBookingConfirmation], bookingConfirmation);

export default router;
