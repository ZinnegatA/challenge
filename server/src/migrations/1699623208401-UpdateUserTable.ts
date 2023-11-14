import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserTable1699623208401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'username');
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
      }),
    ]);
    await queryRunner.changeColumn(
      'user',
      'photo',
      new TableColumn({
        name: 'photo',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['first_name', 'last_name']);
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'username',
        type: 'varchar',
      }),
    );
    await queryRunner.changeColumn(
      'user',
      'photo',
      new TableColumn({
        name: 'photo',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
