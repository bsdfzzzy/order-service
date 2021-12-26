import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Order } from 'typeorm/entities/orders/Order';

import { BAD_REQUEST, BOOKING_EVIDENCE_ID_INVALID, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const bookingConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { id, bid } = req.params;
  const { result } = req.body;

  const orderRepository = getRepository(Order);

  try {
    const order = await orderRepository.findOne(id);

    if (order.booking_evidence_id !== bid) {
      throw new CustomError(BAD_REQUEST, ErrorType.Validation, BOOKING_EVIDENCE_ID_INVALID);
    }

    order.status = result === OrderBookingStatus.SUCCEED ? OrderStatus.BOOKING_SUCCESSED : OrderStatus.BOOKING_FAILED;
    await orderRepository.save(order);
    res.customSuccess(SUCCESS, ORDER_CREATED, order);
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
