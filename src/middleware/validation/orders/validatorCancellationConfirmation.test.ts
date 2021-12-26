import { BAD_REQUEST, ORDER_CANCELLATION_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { OrderCancellationStatus } from '../../../types/BookingEngine';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

import { validatorCancellationConfirmation } from './validatorCancellationConfirmation';

describe('validatorCancellationConfirmation', () => {
  const validationError = new CustomError(
    BAD_REQUEST,
    ErrorType.Validation,
    ORDER_CANCELLATION_CONFIRMATION_REQUEST_BODY_VALIDATION_ERROR,
    null,
    null,
  );
  let spyNext: jest.Mock;
  beforeEach(() => {
    spyNext = jest.fn();
  });

  it('next function should call validation error when input is invalid', async () => {
    const invalidRequest = {
      body: {
        result: '',
      },
    };

    const invalidRequest2 = {
      body: {
        result: 'Dummy',
      },
    };

    const result = await validatorCancellationConfirmation(invalidRequest as any, {} as any, spyNext);
    const result2 = await validatorCancellationConfirmation(invalidRequest2 as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
  });

  it('next function should call nothing when validation passed', async () => {
    const validRequest = {
      body: {
        result: OrderCancellationStatus.SUCCEED,
      },
    };

    await validatorCancellationConfirmation(validRequest as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
  });
});
