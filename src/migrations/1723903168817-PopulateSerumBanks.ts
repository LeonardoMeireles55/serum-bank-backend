import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSerumBanks1687390937162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (let i = 0; i < 10; i++) {
      await queryRunner.query(
        `INSERT INTO serum_banks (serum_bank_code, capacity, available_capacity, created_at, updated_at) 
        VALUES ('A-${i}', 100, 100, NOW(), NOW())`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (let i = 0; i < 10; i++) {
      await queryRunner.query(
        `DELETE FROM serum_banks WHERE serum_bank_code = 'A-${i}'`,
      );
    }
  }
}
