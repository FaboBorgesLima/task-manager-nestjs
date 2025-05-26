import { MigrationInterface, QueryRunner } from "typeorm";

export class UserBcryptPassword1748220897691 implements MigrationInterface {
    name = 'UserBcryptPassword1748220897691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character(60) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character(43) NOT NULL`);
    }

}
