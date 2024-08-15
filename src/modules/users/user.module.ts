import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { DatabaseModule } from '../database/database.module';
import { databaseProviders } from '../database/database.providers';
import { UserRepository } from './repositories/user.repository';
import { UserDataRepository } from './repositories/user-data.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserService, UserRepository, UserDataRepository],
  exports: [UserService],
})
export class UsersModule {}
