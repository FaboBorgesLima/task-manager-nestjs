import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatingTask1746248065952 implements MigrationInterface {
  name = 'CreatingTask1746248065952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('pending', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" BIGSERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL, "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`,
    );
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
