import { BAD_REQUEST, ORDER_CREATION_REQUEST_BODY_VALIDATION_ERROR } from '../../../consts';
import { ErrorType } from '../../../types/CustomError';
import { CustomError } from '../../../utils/response/CustomError';

import { validatorCreate } from './validatorCreate';

describe('validatorCreate', () => {
  const validationError = new CustomError(
    BAD_REQUEST,
    ErrorType.Validation,
    ORDER_CREATION_REQUEST_BODY_VALIDATION_ERROR,
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
        employeeId: '',
        productId: '',
      },
    };

    const invalidRequest2 = {
      body: {
        employeeId: 'id',
        productId: '',
      },
    };

    const invalidRequest3 = {
      body: {
        employeeId: '',
        productId: 'id',
      },
    };

    const result = await validatorCreate(invalidRequest as any, {} as any, spyNext);
    const result2 = await validatorCreate(invalidRequest2 as any, {} as any, spyNext);
    const result3 = await validatorCreate(invalidRequest3 as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
  });

  it('next function should call nothing when validation passed', async () => {
    const validRequest = {
      body: {
        employeeId: 'id',
        productId: 'id',
      },
    };

    const result = await validatorCreate(validRequest as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalledWith(expect.anything());
  });
});
