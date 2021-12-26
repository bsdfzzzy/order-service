import { Request, Response, NextFunction } from 'express';

import { BAD_REQUEST, ORDER_CANCELLATION_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { OrderCancellationStatus } from '../../../types/BookingEngine';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

export const validatorCancellationConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { result } = req.body;

  if (!result || !(result in OrderCancellationStatus)) {
    const validationError = new CustomError(
      BAD_REQUEST,
      ErrorType.Validation,
      ORDER_CANCELLATION_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR,
      null,
      null,
    );
    return next(validationError);
  }

  return next();
};
