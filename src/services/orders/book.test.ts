import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { booking } from '../../adapters/bookingEngine';
import { ORDER_BOOKING_SUCCEED, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { EmployeeInfo } from '../../types/Employee';
import { CustomError } from '../../utils/response/CustomError';

import { book } from './book';
import { create } from './create';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});
jest.mock('../../adapters/bookingEngine');

const repositoryCreationEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.CREATED,
};

const updatedRepositoryCreationEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING,
  booking_evidence_id: 'booking_evidence_id',
};

const employeeInfo: EmployeeInfo = {
  personName: 'name',
  identificationNumber: '1111111111111111111111',
  mobilePhone: '13800000000',
};

describe('book order', () => {
  const request: any = {
    params: {
      id: 1,
    },
    body: {
      ...employeeInfo,
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

  it('should successfully book order', async () => {
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryCreationEntity);
    when(booking)
      .calledWith({
        orderId: 1,
        productId: 'product_id',
        ...employeeInfo,
      })
      .mockResolvedValue('booking_evidence_id');
    when(stubSave)
      .calledWith({
        ...repositoryCreationEntity,
        status: OrderStatus.BOOKING,
        booking_evidence_id: 'booking_evidence_id',
      })
      .mockResolvedValue(updatedRepositoryCreationEntity);

    await book(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(
      SUCCESS,
      ORDER_BOOKING_SUCCEED,
      updatedRepositoryCreationEntity,
    );
  });

  it('next function should call error when the book method rejects an error', async () => {
    const customError = new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, 'any message');
    when(booking)
      .calledWith({
        orderId: 1,
        productId: 'product_id',
        ...employeeInfo,
      })
      .mockRejectedValue(customError);

    await book(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(customError);
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyCustomSuccess).not.toHaveBeenCalled();
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubFindOne.mockRejectedValue('dummy error');

    await book(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
