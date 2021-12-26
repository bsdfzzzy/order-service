import axios from 'axios';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../src';
import { dbCreateConnection } from '../src/typeorm/dbCreateConnection';
import { OrderEntity } from '../src/typeorm/entities/orders/OrderEntity';
import { OrderStatus } from '../src/typeorm/entities/orders/types';

jest.setTimeout(20000);

jest.mock('axios');

const employeeInfo = {
  personName: 'personName',
  identificationNumber: '111111111111111111',
  mobilePhone: '13800000000',
};

describe('Orders API', () => {
  let dbConnection: Connection;
  let orderRepository: Repository<OrderEntity>;

  let order;

  beforeAll(async () => {
    dbConnection = await dbCreateConnection();
    orderRepository = getRepository(OrderEntity);
  });

  afterAll(async () => {
    await orderRepository.delete(order.id);
  });

  it('should create an order and get it', async () => {
    const {
      body: { data: createdOrder },
    } = await request(app).post('/v1/orders').send({ productId: 'productId', employeeId: 'employeeId' });
    order = createdOrder;
    const {
      body: { data: getOrder },
    } = await request(app).get(`/v1/orders/${order.id}`).send();
    expect(getOrder.id).toEqual(order.id);
  });

  it('should book this order successfully', async () => {
    const {
      body: { data: bookingOrder },
    } = await request(app).post(`/v1/orders/${order.id}/bookings`).send(employeeInfo);

    expect(bookingOrder.status).toEqual(OrderStatus.BOOKING);

    await request(app).post(`/v1/orders/${order.id}/bookings/${bookingOrder.bookingEvidenceId}`);
    const {
      body: { data: bookedOrder },
    } = await request(app).get(`/v1/orders/${order.id}`).send();
    expect(bookedOrder.status).toEqual(OrderStatus.BOOKING_SUCCESSED);
  });

  it('should cancel this order successfully', async () => {
    const {
      body: { data: cancellingOrder },
    } = await request(app).post(`/v1/orders/${order.id}/cancellations`).send();

    expect(cancellingOrder.status).toEqual(OrderStatus.CANCELLING);

    await request(app).post(`/v1/orders/${order.id}/cancellations/${cancellingOrder.bookingEvidenceId}`);
    const {
      body: { data: cancelledOrder },
    } = await request(app).get(`/v1/orders/${order.id}`).send();
    expect(cancelledOrder.status).toEqual(OrderStatus.BOOKING_SUCCESSED);
  });
});
