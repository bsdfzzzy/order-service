import { Request, Response, NextFunction } from 'express';

import { BAD_REQUEST, ORDER_CREATION_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { employeeId, productId } = req.body;

  if (!employeeId || !productId) {
    const validationError = new CustomError(
      BAD_REQUEST,
      ErrorType.Validation,
      ORDER_CREATION_REQUEST_BODY_VALIDATION_ERROR,
      null,
      null,
    );
    return next(validationError);
  }

  return next();
};
