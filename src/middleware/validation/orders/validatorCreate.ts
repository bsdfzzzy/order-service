import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { employeeId, productId, employeeInfo } = req.body;

  if (!employeeId || !productId || !employeeInfo) {
    const validationError = new CustomError(400, 'Validation', 'Create order validation error', null, null);
    return next(validationError);
  }

  return next();
};
