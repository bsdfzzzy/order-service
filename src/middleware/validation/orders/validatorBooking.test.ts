import { BAD_REQUEST, ORDER_BOOKING_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

import { validatorBooking } from './validatorBooking';

describe('validatorBooking', () => {
  const validationError = new CustomError(
    BAD_REQUEST,
    ErrorType.Validation,
    ORDER_BOOKING_REQUEST_BODY_VALIDATION_ERROR,
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
        personName: '',
        identificationNumber: '',
        mobilePhone: '',
      },
    };

    const invalidRequest2 = {
      body: {
        personName: 'name',
        identificationNumber: '',
        mobilePhone: '',
      },
    };

    const invalidRequest3 = {
      body: {
        personName: '',
        identificationNumber: 'number',
        mobilePhone: '',
      },
    };

    const invalidRequest4 = {
      body: {
        personName: '',
        identificationNumber: '',
        mobilePhone: 'phone',
      },
    };

    const result = await validatorBooking(invalidRequest as any, {} as any, spyNext);
    const result2 = await validatorBooking(invalidRequest2 as any, {} as any, spyNext);
    const result3 = await validatorBooking(invalidRequest3 as any, {} as any, spyNext);
    const result4 = await validatorBooking(invalidRequest4 as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(4, validationError);
  });

  it('next function should call nothing when validation passed', async () => {
    const validRequest = {
      body: {
        personName: 'name',
        identificationNumber: 'number',
        mobilePhone: 'phone',
      },
    };

    const result = await validatorBooking(validRequest as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
  });
});
