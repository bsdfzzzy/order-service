import { Request, Response, NextFunction } from 'express';

import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { employeeId, productId, employeeInfo } = req.body;

  if (!employeeId || !productId || !employeeInfo) {
    const validationError = new CustomError(400, ErrorType.Validation, 'Create order validation error', null, null);
    return next(validationError);
  }

  return next();
};
