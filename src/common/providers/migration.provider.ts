import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    console.log('Running migrations...');
    await this.dataSource.runMigrations();
    console.log('Migrations complete.');
  }
}
