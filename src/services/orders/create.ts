import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { OrderEntity } from 'typeorm/entities/orders/OrderEntity';

import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, employeeId, managerId } = req.body;

  const orderRepository = getRepository(OrderEntity);

  try {
    const order = await orderRepository.create({
      product_id: productId,
      employee_id: employeeId,
      manager_id: managerId,
    });
    await orderRepository.save(order);
    res.customSuccess(SUCCESS, ORDER_CREATED, new Order(order));
  } catch (e) {
    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
