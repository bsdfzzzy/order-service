import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { booking } from 'adapters/bookingEngine';
import { Order } from 'typeorm/entities/orders/Order';

import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

export const book = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { personName, identificationNumber, mobilePhone } = req.body;

  const orderRepository = getRepository(Order);

  try {
    const order = await orderRepository.findOne(id);
    const bookingEvidenceId = await booking({
      orderId: order.id,
      productId: order.product_id,
      personName,
      identificationNumber,
      mobilePhone,
    });

    order.booking_evidence_id = bookingEvidenceId;
    order.status = OrderStatus.BOOKING;

    await orderRepository.save(order);

    res.customSuccess(SUCCESS, ORDER_CREATED, order);
  } catch (e) {
    if (e instanceof CustomError) {
      return next(e);
    }

    return next(new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, e));
  }
};
