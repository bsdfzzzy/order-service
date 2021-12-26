import { NextFunction, Request, Response } from 'express';

import { SUCCESS } from '../../consts';
import { OrderBookingStatus } from '../../types/BookingEngine';

export const getBookingInfo = async (req: Request, res: Response, next: NextFunction) => {
  res.customSuccess(SUCCESS, null, {
    id: 'bookingEvidenceId',
    finished: true,
    result: OrderBookingStatus.SUCCEED,
  });
};
