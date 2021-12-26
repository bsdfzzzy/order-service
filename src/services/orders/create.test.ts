import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts';
import { OrderEntity } from '../../typeorm/entities/orders/OrderEntity';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

import { create } from './create';

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

describe('create order', () => {
  const request: any = {
    body: {
      productId: 'product_id',
      employeeId: 'employee_id',
    },
  };
  const spyCustomSuccess = jest.fn();
  const fakeResponse: any = {
    customSuccess: spyCustomSuccess,
  };
  const spyNext = jest.fn();
  const stubCreateOrder = jest.fn();
  const stubSave = jest.fn();
  (getRepository as jest.Mock).mockReturnValue({
    create: stubCreateOrder,
    save: stubSave,
  });

  it('should successfully create order', async () => {
    when(stubCreateOrder)
      .calledWith({ product_id: 'product_id', employee_id: 'employee_id' })
      .mockReturnValue(repositoryCreationEntity);
    when(stubSave).calledWith(repositoryCreationEntity).mockReturnValue(repositoryCreationEntity);

    await create(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(
      SUCCESS,
      ORDER_CREATED,
      new Order(repositoryCreationEntity),
    );
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubCreateOrder.mockRejectedValue('dummy error');

    await create(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
