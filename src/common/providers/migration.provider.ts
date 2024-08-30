import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'src/modules/database/database';

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(private readonly dataSource: Database) {}

  async onModuleInit() {
    console.log('Running migrations...');
    await this.dataSource.getConnection().runMigrations();
    console.log('Migrations complete.');
  }
}
