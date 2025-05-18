import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTask1747532657995 implements MigrationInterface {
    name = 'RefactorTask1747532657995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "start" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "end" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
