import { OrderEntity } from '../../typeorm/entities/orders/OrderEntity';
import { OrderStatus } from '../../typeorm/entities/orders/types';

export class Order {
  id: number;
  productId: string;
  employeeId: string;
  managerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.productId = orderEntity.product_id;
    this.employeeId = orderEntity.employee_id;
    this.managerId = orderEntity.manager_id;
    this.status = orderEntity.status;
    this.createdAt = orderEntity.created_at;
    this.updatedAt = orderEntity.updated_at;
  }
}
