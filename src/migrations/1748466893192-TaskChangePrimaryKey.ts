import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskChangePrimaryKey1748466893192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // change primary key of task table from bigint to uuid
    await queryRunner.query(`
            ALTER TABLE "tasks"
            DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772",
            DROP COLUMN "id",
            ADD COLUMN "id" uuid NOT NULL DEFAULT gen_random_uuid(),
            ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert primary key of task table from uuid to bigint
    await queryRunner.query(`
            ALTER TABLE "tasks"
            DROP CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772",
            DROP COLUMN "id",
            ADD COLUMN "id" BIGSERIAL NOT NULL,
            ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
        `);
  }
}
