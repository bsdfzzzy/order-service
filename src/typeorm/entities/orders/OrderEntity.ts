import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { OrderStatus } from './types';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: string;

  @Column()
  employee_id: string;

  @Column({
    nullable: true,
  })
  manager_id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column({
    nullable: true,
  })
  booking_evidence_id: string;

  @Column({
    nullable: true,
  })
  change_evidence_id: string;

  @Column({
    nullable: true,
  })
  cancellation_evidence_id: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
