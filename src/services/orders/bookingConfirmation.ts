import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OrderEntity } from 'typeorm/entities/orders/OrderEntity';

import {
  BAD_REQUEST,
  BOOKING_EVIDENCE_ID_INVALID,
  ORDER_BOOKING_CONFIRMATION_SUCCEED,
  SERVER_ERROR,
  SUCCESS,
  UNKNOWN_ERROR,
} from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const bookingConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { id, bid } = req.params;
  const { result } = req.body;

  const orderRepository = getRepository(OrderEntity);

  try {
    const order = await orderRepository.findOne(id);

    if (order.booking_evidence_id !== bid) {
      throw new CustomError(BAD_REQUEST, ErrorType.Validation, BOOKING_EVIDENCE_ID_INVALID);
    }

    order.status = result === OrderBookingStatus.SUCCEED ? OrderStatus.BOOKING_SUCCESSED : OrderStatus.BOOKING_FAILED;
    await orderRepository.save(order);
    res.customSuccess(SUCCESS, ORDER_BOOKING_CONFIRMATION_SUCCEED);
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
