import { Request, Response, NextFunction } from 'express';

import { BAD_REQUEST, ORDER_BOOKING_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { OrderBookingStatus } from '../../../types/BookingEngine';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

export const validatorBookingConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { result } = req.body;

  if (!result || !(result in OrderBookingStatus)) {
    const validationError = new CustomError(
      BAD_REQUEST,
      ErrorType.Validation,
      ORDER_BOOKING_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR,
      null,
      null,
    );
    return next(validationError);
  }

  return next();
};
