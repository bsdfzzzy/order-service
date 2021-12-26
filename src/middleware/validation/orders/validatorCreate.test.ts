import { CustomError } from '../../../utils/response/custom-error/CustomError';

import { validatorCreate } from './validatorCreate';

describe('validatorCreate', () => {
  const validationError = new CustomError(400, 'Validation', 'Create order validation error', null, null);
  let spyNext: jest.Mock;
  beforeEach(() => {
    spyNext = jest.fn();
  });

  it('should return validation error when input is invalid', async () => {
    const invalidRequest = {
      body: {
        employeeId: '',
        productId: '',
        employeeInfo: {},
      },
    };

    const invalidRequest2 = {
      body: {
        employeeId: 'id',
        productId: '',
        employeeInfo: {},
      },
    };

    const invalidRequest3 = {
      body: {
        employeeId: '',
        productId: 'id',
        employeeInfo: {},
      },
    };

    const result = await validatorCreate(invalidRequest as any, {} as any, spyNext);
    const result2 = await validatorCreate(invalidRequest2 as any, {} as any, spyNext);
    const result3 = await validatorCreate(invalidRequest3 as any, {} as any, spyNext);

    expect(spyNext).toHaveBeenNthCalledWith(1, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(2, validationError);
    expect(spyNext).toHaveBeenNthCalledWith(3, validationError);
  });

  it('should return nothing when validation passed', async () => {
    const validRequest = {
      body: {
        employeeId: 'id',
        productId: 'id',
        employeeInfo: {},
      },
    };

    const result = await validatorCreate(validRequest as any, {} as any, spyNext);

    expect(spyNext).toBeUndefined();
  });
});
