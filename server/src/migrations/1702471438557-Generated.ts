import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1702471438557 implements MigrationInterface {
  name = 'Generated1702471438557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "solution" ("id" SERIAL NOT NULL, "codewarsId" character varying NOT NULL, "fastestSolution" boolean NOT NULL, "completedAt" TIMESTAMP NOT NULL, "taskId" character varying, "userId" integer, CONSTRAINT "PK_73fc40b114205776818a2f2f248" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ADD CONSTRAINT "FK_709e242f625834e6de829ea3b5c" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ADD CONSTRAINT "FK_577971bf35a3f85b2d6edd8329e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solution" DROP CONSTRAINT "FK_577971bf35a3f85b2d6edd8329e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" DROP CONSTRAINT "FK_709e242f625834e6de829ea3b5c"`,
    );
    await queryRunner.query(`DROP TABLE "solution"`);
  }
}
