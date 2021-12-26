import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import * as bookingEngine from '../../adapters/bookingEngine';
import { ORDER_CANCELLING_SUCCEED, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { ErrorType } from '../../types/CustomError';
import { EmployeeInfo } from '../../types/Employee';
import { CustomError } from '../../utils/response/CustomError';
import { Order } from '../models/order';

import { book } from './book';
import { cancel } from './cancel';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});
jest.mock('../../adapters/bookingEngine');

const repositoryBookingEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING,
  booking_evidence_id: 'booking_evidence_id',
};

const repositoryBookSucceedEntity = {
  ...repositoryBookingEntity,
  status: OrderStatus.BOOKING_SUCCESSED,
};

const updatedRepositoryCreationEntity = {
  ...repositoryBookingEntity,
  status: OrderStatus.CANCELLING,
  cancellation_evidence_id: 'cancellation_evidence_id',
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

  it('should successfully cancel order', async () => {
    when(stubFindOne)
      .calledWith(1)
      .mockReturnValueOnce(repositoryBookingEntity)
      .mockReturnValueOnce(repositoryBookSucceedEntity);
    when(bookingEngine.cancel)
      .calledWith({
        orderId: 1,
        bookingEvidenceId: 'booking_evidence_id',
      })
      .mockResolvedValue('cancellation_evidence_id');
    when(stubSave).calledWith(updatedRepositoryCreationEntity).mockResolvedValue(updatedRepositoryCreationEntity);

    await cancel(request, fakeResponse, spyNext);
    await cancel(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenNthCalledWith(
      1,
      SUCCESS,
      ORDER_CANCELLING_SUCCEED,
      new Order(updatedRepositoryCreationEntity as any),
    );
    expect(fakeResponse.customSuccess).toHaveBeenNthCalledWith(
      2,
      SUCCESS,
      ORDER_CANCELLING_SUCCEED,
      new Order(updatedRepositoryCreationEntity as any),
    );
  });

  it('next function should call error when the cancel method rejects an error', async () => {
    const customError = new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, 'any message');
    when(stubFindOne).calledWith(1).mockReturnValueOnce(repositoryBookingEntity);
    when(bookingEngine.cancel)
      .calledWith({
        orderId: 1,
        bookingEvidenceId: 'booking_evidence_id',
      })
      .mockRejectedValue(customError);

    await cancel(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(customError);
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyCustomSuccess).not.toHaveBeenCalled();
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubFindOne.mockRejectedValue('dummy error');

    await cancel(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
