import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Order } from 'typeorm/entities/orders/Order';

import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, employeeId, managerId } = req.body;

  const orderRepository = getRepository(Order);

  try {
    const order = await orderRepository.create({
      product_id: productId,
      employee_id: employeeId,
      manager_id: managerId,
    });
    res.customSuccess(SUCCESS, ORDER_CREATED, order);
  } catch (e) {
    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
