import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { booking } from 'adapters/bookingEngine';
import { Order } from 'typeorm/entities/orders/Order';

import { SUCCESS } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const orderRepository = getRepository(Order);

  try {
    const order = await orderRepository.findOne(id);
  } catch (e) {
    return next(e);
  }
};
