import { when } from 'jest-when';
import { getRepository } from 'typeorm';

import { book } from '../../adapters/bookingEngine';
import { Order } from '../../typeorm/entities/orders/Order';
import { OrderStatus } from '../../typeorm/entities/orders/types';
import { EmployeeInfo } from '../../types/Employee';

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
  it('should successfully create order', async () => {
    const spyCustomSuccess = jest.fn();
    const fakeResponse: any = {
      customSuccess: spyCustomSuccess,
    };
    const spyNext = jest.fn();
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

    const request: any = {
      body: {
        productId: 'product_id',
        employeeId: 'employee_id',
        employeeInfo,
      },
    };
    await create(request, fakeResponse, spyNext);

    expect(fakeResponse.customSuccess).toHaveBeenCalledWith(200, 'Order successfully saved.', repositoryCreationEntity);
  });
});
