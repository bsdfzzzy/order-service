import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OrderEntity } from 'typeorm/entities/orders/OrderEntity';

import { cancel as cancelOrder } from '../../adapters/bookingEngine';
import { ORDER_CANCELLING_SUCCEED, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const orderRepository = getRepository(OrderEntity);

  try {
    const order = await orderRepository.findOne(id);
    if (order.status === OrderStatus.BOOKING || OrderStatus.BOOKING_SUCCESSED) {
      const cancellationEvidenceId = await cancelOrder({
        orderId: order.id,
        bookingEvidenceId: order.booking_evidence_id,
      });
      order.status = OrderStatus.CANCELLING;
      order.cancellation_evidence_id = cancellationEvidenceId;
    } else {
      order.status = OrderStatus.CANCELLED;
    }

    await orderRepository.save(order);

    res.customSuccess(SUCCESS, ORDER_CANCELLING_SUCCEED, new Order(order));
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
