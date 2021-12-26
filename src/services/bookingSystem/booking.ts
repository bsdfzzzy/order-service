import { NextFunction, Request, Response } from 'express';

import { SUCCESS } from '../../consts';

export const booking = async (req: Request, res: Response, next: NextFunction) => {
  res.customSuccess(SUCCESS, null, {
    evidenceId: 'bookingEvidenceId',
  });
};
