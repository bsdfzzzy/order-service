import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { BAD_REQUEST, BOOKING_EVIDENCE_ID_INVALID, SERVER_ERROR, SUCCESS, UNKNOWN_ERROR } from '../../consts';
import { ORDER_CREATED } from '../../consts/ResponseMessages';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { OrderBookingStatus } from '../../types/BookingEngine';
import { ErrorType } from '../../types/CustomError';
import { CustomError } from '../../utils/response/CustomError';

import { bookingConfirmation } from './bookingConfirmation';
import { create } from './create';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});

const repositoryCreationEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING,
  booking_evidence_id: 'booking_evidence_id',
};

const updatedRepositoryCreationEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING_SUCCESSED,
  booking_evidence_id: 'booking_evidence_id',
};

describe('booking conformation', () => {
  const request: any = {
    params: {
      id: 1,
      bid: 'booking_evidence_id',
    },
    body: {
      result: OrderBookingStatus.SUCCEED,
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
    when(stubSave)
      .calledWith({
        ...repositoryCreationEntity,
        status: OrderStatus.BOOKING_SUCCESSED,
      })
      .mockResolvedValue(updatedRepositoryCreationEntity);

    await bookingConfirmation(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(SUCCESS, ORDER_CREATED, updatedRepositoryCreationEntity);
  });

  it('book order failed', async () => {
    const failedRequest = {
      ...request,
      body: {
        result: OrderStatus.BOOKING_FAILED,
      },
    };
    const updatedFailedRepositoryCreationEntity = {
      ...updatedRepositoryCreationEntity,
      status: OrderStatus.BOOKING_FAILED,
    };
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryCreationEntity);
    when(stubSave)
      .calledWith({
        ...repositoryCreationEntity,
        status: OrderStatus.BOOKING_FAILED,
      })
      .mockResolvedValue(updatedFailedRepositoryCreationEntity);

    await bookingConfirmation(failedRequest, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(
      SUCCESS,
      ORDER_CREATED,
      updatedFailedRepositoryCreationEntity,
    );
  });

  it('next function should call error when the given booking evidence is not correct', async () => {
    request.params.bid = 'bid';
    const customError = new CustomError(BAD_REQUEST, ErrorType.Validation, BOOKING_EVIDENCE_ID_INVALID);
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryCreationEntity);

    await bookingConfirmation(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(customError);
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyCustomSuccess).not.toHaveBeenCalled();
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubFindOne.mockRejectedValue('dummy error');

    await bookingConfirmation(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
