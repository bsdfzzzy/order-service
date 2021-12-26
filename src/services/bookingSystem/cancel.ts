import { NextFunction, Request, Response } from 'express';

import { SUCCESS } from '../../consts';

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  res.customSuccess(SUCCESS, null, {
    evidenceId: 'cancellationEvidenceId',
  });
};
