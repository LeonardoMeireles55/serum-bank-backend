import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserMigration1723723996229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insere um usuário na tabela UserData
    await queryRunner.query(`
                  INSERT INTO users_data (phone, profissional_position, created_at)
                  VALUES ('12345678901', 'laboratory_analist', CURRENT_TIMESTAMP)
                  RETURNING id;
                `);

    // Obtém o ID do UserData recém-criado
    const userDataId = await queryRunner.query(
      `SELECT id FROM users_data WHERE phone = '12345678901'`,
    );

    // Insere um usuário na tabela Users
    await queryRunner.query(`
                  INSERT INTO users (email, password, type_access, users_data_id, created_at)
                  VALUES ('admin@admin.com', '$2b$10$2/pGuGAUZsoggfNlHHW2f.PSZ4T59zX0auQWbCefEHSWgrWdDbXdm', 'admin', ${userDataId[0].id}, CURRENT_TIMESTAMP)
                  RETURNING id;
                `);

    // Obtém o ID do User recém-criado
    const userId = await queryRunner.query(
      `SELECT id FROM users WHERE email = 'admin@admin.com'`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove o usuário
    await queryRunner.query(`
          DELETE FROM users WHERE email = 'example@example.com';
        `);

    // Remove os dados do usuário
    await queryRunner.query(`
          DELETE FROM users_data WHERE phone = '12345678901';
        `);
  }
}