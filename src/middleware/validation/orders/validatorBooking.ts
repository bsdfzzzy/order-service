import { Request, Response, NextFunction } from 'express';

import { BAD_REQUEST, ORDER_BOOKING_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

export const validatorBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { personName, identificationNumber, mobilePhone } = req.body;

  if (!personName || !identificationNumber || !mobilePhone) {
    const validationError = new CustomError(
      BAD_REQUEST,
      ErrorType.Validation,
      ORDER_BOOKING_REQUEST_BODY_VALIDATION_ERROR,
      null,
      null,
    );
    return next(validationError);
  }

  return next();
};
