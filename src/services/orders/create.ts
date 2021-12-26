import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { book } from 'adapters/bookingEngine';
import { Order } from 'typeorm/entities/orders/Order';

import { SUCCESS } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, employeeId, managerId, employeeInfo } = req.body;

  const orderRepository = getRepository(Order);

  try {
    if (!managerId) {
      const bookingEvidenceId = await book({
        productId,
        ...employeeInfo,
      });
      const order = await orderRepository.create({
        product_id: productId,
        employee_id: employeeId,
        booking_evidence_id: bookingEvidenceId,
      });
      res.customSuccess(SUCCESS, ORDER_CREATED, order);
    }
  } catch (e) {
    return next(e);
  }
};
