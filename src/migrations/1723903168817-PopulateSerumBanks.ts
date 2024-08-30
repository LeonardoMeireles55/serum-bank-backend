import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSerumBanks1687390937162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const daysOfWeek = [
      'DOMINGO-1',
      'DOMINGO-2',
      'SEGUNDA-1',
      'SEGUNDA-2',
      'TERÇA-1',
      'TERÇA-2',
      'QUARTA-1',
      'QUARTA-2',
      'QUINTA-1',
      'QUINTA-2',
      'SEXTA-1',
      'SEXTA-2',
      'SABADO-1',
      'SABADO-2',
    ];
    for (let i = 0; i < daysOfWeek.length; i++) {
      await queryRunner.query(
        `INSERT INTO serum_banks (serum_bank_code, capacity, available_capacity, created_at, updated_at) 
        VALUES ('${daysOfWeek[i]}', 100, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const daysOfWeek = [
      'DOMINGO-1',
      'DOMINGO-2',
      'SEGUNDA-1',
      'SEGUNDA-2',
      'TERÇA-1',
      'TERÇA-2',
      'QUARTA-1',
      'QUARTA-2',
      'QUINTA-1',
      'QUINTA-2',
      'SEXTA-1',
      'SEXTA-2',
      'SABADO-1',
      'SABADO-2',
    ];
    for (let i = 0; i < daysOfWeek.length; i++) {
      await queryRunner.query(
        `DELETE FROM serum_banks WHERE serum_bank_code = '${daysOfWeek[i]}'`,
      );
    }
  }
}
