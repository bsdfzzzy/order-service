import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OrderEntity } from 'typeorm/entities/orders/OrderEntity';

import { getBookingInfo, getCancellationInfo } from '../../adapters/bookingEngine';
import { GET_ORDER_SUCCESS, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus, OrderCancellationStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const orderRepository = getRepository(OrderEntity);

  try {
    const order = await orderRepository.findOne(id);

    if (order.status === OrderStatus.BOOKING) {
      const bookingInfo = await getBookingInfo(order.booking_evidence_id);
      if (bookingInfo.finished) {
        order.status =
          bookingInfo.result === OrderBookingStatus.SUCCEED
            ? OrderStatus.BOOKING_SUCCESSED
            : OrderStatus.BOOKING_FAILED;
        await orderRepository.save(order);
      }
    }

    if (order.status === OrderStatus.CANCELLING) {
      const cancellationInfo = await getCancellationInfo(order.cancellation_evidence_id);
      if (cancellationInfo.finished) {
        order.status =
          cancellationInfo.result === OrderCancellationStatus.SUCCEED
            ? OrderStatus.CANCELLED
            : OrderStatus.CANCELL_FAILED;
        await orderRepository.save(order);
      }
    }

    res.customSuccess(SUCCESS, GET_ORDER_SUCCESS, new Order(order));
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
