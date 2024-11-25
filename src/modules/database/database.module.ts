import { Module } from '@nestjs/common';
import { Database } from './database';
import { databaseProviders } from './database.providers';
import { AppConfigModule } from '../../app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [Database, ...databaseProviders],
  exports: [Database, ...databaseProviders],
})
export class DatabaseModule {}
