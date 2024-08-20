import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSerumBanks1687390937162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const daysOfWeek = [
      'SEGUNDA - A',
      'SEGUNDA - B',
      'TERÇA - A',
      'TERÇA - B',
      'QUARTA - A',
      'QUARTA - B',
      'QUINTA - A',
      'QUINTA - B',
      'SEXTA - A',
      'SEXTA - B',
      'SABADO - A',
      'SABADO - B',
      'DOMINGO - A',
      'DOMINGO - B',
    ];
    for (let i = 0; i < daysOfWeek.length; i++) {
      await queryRunner.query(
        `INSERT INTO serum_banks (serum_bank_code, capacity, available_capacity, created_at, updated_at) 
        VALUES ('${daysOfWeek[i]}', 100, 100, NOW(), NOW())`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const daysOfWeek = [
      'SEGUNDA - A',
      'SEGUNDA - B',
      'TERÇA - A',
      'TERÇA - B',
      'QUARTA - A',
      'QUARTA - B',
      'QUINTA - A',
      'QUINTA - B',
      'SEXTA - A',
      'SEXTA - B',
      'SABADO - A',
      'SABADO - B',
      'DOMINGO - A',
      'DOMINGO - B',
    ];
    for (let i = 0; i < daysOfWeek.length; i++) {
      await queryRunner.query(
        `DELETE FROM serum_banks WHERE serum_bank_code = '${daysOfWeek[i]}'`,
      );
    }
  }
}
