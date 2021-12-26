import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1640444887910 implements MigrationInterface {
  name = 'CreateOrders1640444887910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "product_id" character varying(100) NOT NULL, "employee_id" character varying(100) NOT NULL, "manager_id" character varying(100), "status" character varying(20) NOT NULL DEFAULT 'CREATED', "booking_evidence_id" character varying(100), "change_evidence_id" character varying(100), "cancellation_evidence_id" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`, undefined);
  }
}
