import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateValidationCodes1748303239132 implements MigrationInterface {
  name = 'CreateValidationCodes1748303239132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "validation_codes" ("id" BIGSERIAL NOT NULL, "email" character varying(255) NOT NULL, "validation_code" character(6) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b3f72e3d8fadcf1a2d53fbeb14" UNIQUE ("email"), CONSTRAINT "PK_16e94d0d38aa00b17a91e889083" PRIMARY KEY ("id")); COMMENT ON COLUMN "validation_codes"."email" IS 'Email address to validate'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "validation_codes"`);
  }
}
