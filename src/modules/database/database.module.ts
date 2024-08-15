import { Module } from '@nestjs/common';
import { Database } from './database';
import { databaseProviders } from './database.providers';

@Module({
  providers: [Database, ...databaseProviders],
  exports: [Database, ...databaseProviders],
})
export class DatabaseModule {}
