import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskChangePrimaryKey1748466893192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // change primary key of task table from bigint to uuid
    await queryRunner.query(`
            ALTER TABLE "task"
            DROP CONSTRAINT "PK_8f9c1b2d3e4f5a6b7c8d9e0f1g2",
            ADD CONSTRAINT "PK_8f9c1b2d3e4f5a6b7c8d9e0f1g2" PRIMARY KEY ("id"::uuid)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
