import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AppConfigModule } from './app-config/app-config.module';
import { SerumBankModule } from './modules/serum-bank/serum-bank.module';

@Module({
  imports: [AppConfigModule, UsersModule, SerumBankModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
