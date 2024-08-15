import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [AppConfigModule, UsersModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class SerumBankModule {}
