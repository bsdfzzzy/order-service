import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { getBookingInfo } from '../../adapters/bookingEngine';
import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { OrderEntity } from '../../typeorm/entities/orders/OrderEntity';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

import { get } from './get';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});
jest.mock('../../adapters/bookingEngine');

const repositoryCreationEntity: OrderEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.CREATED,
} as any;

const bookingUpdatedRepositoryCreationEntity: OrderEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING_SUCCESSED,
  booking_evidence_id: 'booking_evidence_id',
} as any;

describe('get order information', () => {
  const request: any = {
    params: {
      id: 1,
    },
  };
  const spyCustomSuccess = jest.fn();
  const fakeResponse: any = {
    customSuccess: spyCustomSuccess,
  };
  const spyNext = jest.fn();
  const stubFindOne = jest.fn();
  const stubSave = jest.fn();
  (getRepository as jest.Mock).mockReturnValue({
    findOne: stubFindOne,
    save: stubSave,
  });

  it('should successfully get order', async () => {
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryCreationEntity);

    await get(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(SUCCESS, null, new Order(repositoryCreationEntity));
  });

  it('should get booking information when order status is BOOKING', async () => {
    when(stubFindOne)
      .calledWith(1)
      .mockReturnValue({
        ...repositoryCreationEntity,
        status: OrderStatus.BOOKING,
        booking_evidence_id: 'booking_evidence_id',
      });
    when(getBookingInfo)
      .calledWith('booking_evidence_id')
      .mockResolvedValue({ id: 'booking_evidence_id', finished: true, result: OrderBookingStatus.SUCCEED });
    when(stubSave)
      .calledWith(bookingUpdatedRepositoryCreationEntity)
      .mockResolvedValue(bookingUpdatedRepositoryCreationEntity);

    await get(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(
      SUCCESS,
      null,
      new Order(bookingUpdatedRepositoryCreationEntity),
    );
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubFindOne.mockRejectedValue('dummy error');

    await get(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
