import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OrderEntity } from 'typeorm/entities/orders/OrderEntity';

import {
  BAD_REQUEST,
  CANCELLATION_EVIDENCE_ID_INVALID,
  ORDER_CANCELLATION_CONFIRMATION_SUCCEED,
  SERVER_ERROR,
  SUCCESS,
  UNKNOWN_ERROR,
} from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderCancellationStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const cancellationConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  const { id, cid } = req.params;
  const { result } = req.body;

  const orderRepository = getRepository(OrderEntity);

  try {
    const order = await orderRepository.findOne(id);

    if (order.cancellation_evidence_id !== cid) {
      throw new CustomError(BAD_REQUEST, ErrorType.Validation, CANCELLATION_EVIDENCE_ID_INVALID);
    }

    order.status = result === OrderCancellationStatus.SUCCEED ? OrderStatus.CANCELLED : OrderStatus.CANCELL_FAILED;
    await orderRepository.save(order);
    res.customSuccess(SUCCESS, ORDER_CANCELLATION_CONFIRMATION_SUCCEED);
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
