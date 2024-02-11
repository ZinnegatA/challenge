import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1707679391957 implements MigrationInterface {
    name = 'Generated1707679391957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solution" ADD "points" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "points"`);
    }

}
