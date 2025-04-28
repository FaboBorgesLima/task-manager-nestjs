import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserTokenAndAddUniqueContraints1745783071490
  implements MigrationInterface
{
  name = 'RemoveUserTokenAndAddUniqueContraints1745783071490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_7869db61ed722d562da1acf6d59"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "token" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_7869db61ed722d562da1acf6d59" UNIQUE ("token")`,
    );
  }
}
