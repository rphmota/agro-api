import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748091482025 implements MigrationInterface {
  name = 'Migration1748091482025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "produtores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "cpfCnpj" character varying NOT NULL, "fazenda" character varying NOT NULL, "cidade" character varying NOT NULL, "estado" character varying NOT NULL, "areaTotal" double precision NOT NULL, "areaAgricultavel" double precision NOT NULL, "areaVegetacao" double precision NOT NULL, "culturas" text NOT NULL, CONSTRAINT "PK_6dc732dcaa5cc1ebf885b0370a0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "produtores"`);
  }
}
