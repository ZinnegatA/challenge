import { MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'bcrypt';

export class InitialMigration1698567562485 implements MigrationInterface {
  name = 'InitialMigration1698567562485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminPassword = await hash('AdminPass', 10);

    await queryRunner.query(
      `CREATE TABLE "run" ("id" SERIAL NOT NULL, "run_start_date" TIMESTAMP NOT NULL, "run_end_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_804c38ffba92002c6d2c646dd46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" character varying NOT NULL, "name" character varying NOT NULL, "completedAt" character varying, "completedLanguages" text array, "points" integer, "fastestSolution" boolean, "runId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "photo" character varying NOT NULL, "telescope_link" character varying NOT NULL, "codewars_username" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tasks_task" ("userId" integer NOT NULL, "taskId" character varying NOT NULL, CONSTRAINT "PK_5c112b153701f554843915f643f" PRIMARY KEY ("userId", "taskId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fb6a986133f8f6cafb3d4fb31" ON "user_tasks_task" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bcb8e9773d79c9874a61f79c3" ON "user_tasks_task" ("taskId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_73f63c44d1a6091dd1001ee4f6f" FOREIGN KEY ("runId") REFERENCES "run"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks_task" ADD CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
      INSERT INTO admin (username, password) VALUES ('Admin', '${adminPassword}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_9bcb8e9773d79c9874a61f79c3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks_task" DROP CONSTRAINT "FK_1fb6a986133f8f6cafb3d4fb31e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_73f63c44d1a6091dd1001ee4f6f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bcb8e9773d79c9874a61f79c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1fb6a986133f8f6cafb3d4fb31"`,
    );
    await queryRunner.query(`DROP TABLE "user_tasks_task"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "run"`);
  }
}
