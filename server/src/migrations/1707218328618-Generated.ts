import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1707218328618 implements MigrationInterface {
    name = 'Generated1707218328618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "solution" ADD "participationId" integer`);
        await queryRunner.query(`ALTER TABLE "solution" ADD CONSTRAINT "FK_2dbe13fda203c3bbde3fba53140" FOREIGN KEY ("participationId") REFERENCES "participation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "solution" DROP CONSTRAINT "FK_2dbe13fda203c3bbde3fba53140"`);
        await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "participationId"`);
        await queryRunner.query(`ALTER TABLE "participation" ADD "score" integer NOT NULL`);
    }

}
