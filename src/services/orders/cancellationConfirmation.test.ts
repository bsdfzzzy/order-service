import { when } from 'jest-when';
import { getRepository } from 'typeorm';

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

import { cancellationConfirmation } from './cancellationConfirmation';

jest.mock('typeorm', () => {
  const typeorm = jest.requireActual('typeorm');
  return {
    ...typeorm,
    getRepository: jest.fn(),
  };
});

const repositoryBookedEntity = {
  id: 1,
  product_id: 'product_id',
  employee_id: 'employee_id',
  status: OrderStatus.BOOKING_SUCCESSED,
  booking_evidence_id: 'booking_evidence_id',
  cancellation_evidence_id: 'cancellation_evidence_id',
};

const updatedRepositoryCreationEntity = {
  ...repositoryBookedEntity,
  status: OrderStatus.CANCELLED,
};

describe('cancellation conformation', () => {
  const request: any = {
    params: {
      id: 1,
      cid: 'cancellation_evidence_id',
    },
    body: {
      result: OrderCancellationStatus.SUCCEED,
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

  it('should successfully confirm cancellation', async () => {
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryBookedEntity);
    when(stubSave)
      .calledWith({
        ...repositoryBookedEntity,
        status: OrderStatus.CANCELLED,
      })
      .mockResolvedValue(updatedRepositoryCreationEntity);

    await cancellationConfirmation(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(SUCCESS, ORDER_CANCELLATION_CONFIRMATION_SUCCEED);
  });

  it('cancel order failed', async () => {
    const failedRequest = {
      ...request,
      body: {
        result: OrderCancellationStatus.FAILED,
      },
    };
    const updatedFailedRepositoryCreationEntity = {
      ...updatedRepositoryCreationEntity,
      status: OrderStatus.CANCELL_FAILED,
    };
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryBookedEntity);
    when(stubSave)
      .calledWith({
        ...repositoryBookedEntity,
        status: OrderStatus.CANCELL_FAILED,
      })
      .mockResolvedValue(updatedFailedRepositoryCreationEntity);

    await cancellationConfirmation(failedRequest, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(SUCCESS, ORDER_CANCELLATION_CONFIRMATION_SUCCEED);
  });

  it('next function should call error when the given cancellation evidence is not correct', async () => {
    request.params.cid = 'bid';
    const customError = new CustomError(BAD_REQUEST, ErrorType.Validation, CANCELLATION_EVIDENCE_ID_INVALID);
    when(stubFindOne).calledWith(1).mockReturnValue(repositoryBookedEntity);

    await cancellationConfirmation(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(customError);
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyCustomSuccess).not.toHaveBeenCalled();
  });

  it('should call custom error when there is dummy error occured', async () => {
    stubFindOne.mockRejectedValue('dummy error');

    await cancellationConfirmation(request, fakeResponse, spyNext);

    expect(spyNext).toHaveBeenCalledWith(
      new CustomError(SERVER_ERROR, ErrorType.Raw, UNKNOWN_ERROR, null, 'dummy error'),
    );
  });
});
