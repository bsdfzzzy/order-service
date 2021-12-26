import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Order } from 'typeorm/entities/orders/Order';

import { getBookingInfo } from '../../adapters/bookingEngine';
import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const orderRepository = getRepository(Order);

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

    res.customSuccess(SUCCESS, null, order);
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
