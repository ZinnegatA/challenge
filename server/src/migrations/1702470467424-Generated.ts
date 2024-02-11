import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1702470467424 implements MigrationInterface {
    name = 'Generated1702470467424';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "participation" ("id" SERIAL NOT NULL, "score" integer NOT NULL, "runId" integer, "userId" integer, CONSTRAINT "PK_ba5442bab90fc96ddde456c69e1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "participation" ADD CONSTRAINT "FK_10a33a8efa8f45a57ced59319f3" FOREIGN KEY ("runId") REFERENCES "run"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "participation" ADD CONSTRAINT "FK_8ed09e9b7e0a3a150f9515f254f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down() {}
}
