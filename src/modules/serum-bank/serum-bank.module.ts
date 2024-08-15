import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/user.module';
import { SerumBankService } from './services/serum-bank.service';
import { SamplesPositionRepository } from './repositories/samples-position.repository';
import { SerumBankRepository } from './repositories/serum-bank.repository';
import { SerumBankController } from './controllers/serum-bank.controller';

@Module({
  imports: [AppConfigModule, UsersModule, DatabaseModule],
  controllers: [SerumBankController],
  providers: [SerumBankService, SerumBankRepository, SamplesPositionRepository],
})
export class SerumBankModule {}
