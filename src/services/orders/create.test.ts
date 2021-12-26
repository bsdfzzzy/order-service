import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { book } from '../../adapters/bookingEngine';
import { SERVER_ERROR, SUCCESS } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { Order } from '../../typeorm/entities/orders/Order';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { EmployeeInfo } from '../../types/Employee';
import { CustomError } from '../../utils/response/CustomError';

import { create } from './create';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});
jest.mock('../../adapters/bookingEngine');

const repositoryCreationEntity: Order = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING,
  booking_evidence_id: 'booking_evidence_id',
} as any;

const employeeInfo: EmployeeInfo = {
  name: 'name',
  identificationNumber: '1111111111111111111111',
  mobilePhone: '13800000000',
};

describe('create order', () => {
  const request: any = {
    body: {
      productId: 'product_id',
      employeeId: 'employee_id',
      employeeInfo,
    },
  };
  const spyCustomSuccess = jest.fn();
  const fakeResponse: any = {
    customSuccess: spyCustomSuccess,
  };
  const spyNext = jest.fn();

  it('should successfully create order', async () => {
    const stubCreateOrder = jest.fn();
    when(stubCreateOrder)
      .calledWith({ product_id: 'product_id', employee_id: 'employee_id', booking_evidence_id: 'booking_evidence_id' })
      .mockReturnValue(repositoryCreationEntity);
    when(book)
      .calledWith({
        productId: 'product_id',
        ...employeeInfo,
      })
      .mockResolvedValue('booking_evidence_id');
    (getRepository as jest.Mock).mockReturnValue({
      create: stubCreateOrder,
    });

    await create(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(SUCCESS, ORDER_CREATED, repositoryCreationEntity);
  });

  it('next function should call error when the book method rejects an error', async () => {
    const customError = new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, 'any message');
    when(book)
      .calledWith({
        productId: 'product_id',
        ...employeeInfo,
      })
      .mockRejectedValue(customError);

    await create(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(customError);
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyCustomSuccess).not.toHaveBeenCalled();
  });
});
