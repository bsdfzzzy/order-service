import { NextFunction, Request, Response } from 'express';

import { SUCCESS } from '../../consts';
import { OrderCancellationStatus } from '../../types/BookingEngine';

export const getCancellationInfo = async (req: Request, res: Response, next: NextFunction) => {
  res.customSuccess(SUCCESS, null, {
    id: 'cancellationEvidenceId',
    finished: true,
    result: OrderCancellationStatus.SUCCEED,
  });
};
