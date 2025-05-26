import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748098220426 implements MigrationInterface {
  name = 'Migration1748098220426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "produtores" DROP COLUMN "culturas"`);
    await queryRunner.query(
      `ALTER TABLE "produtores" ADD "culturas" text array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "produtores" DROP COLUMN "culturas"`);
    await queryRunner.query(
      `ALTER TABLE "produtores" ADD "culturas" text NOT NULL`,
    );
  }
}
