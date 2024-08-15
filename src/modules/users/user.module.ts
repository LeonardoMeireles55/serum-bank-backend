import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './repositories/user.repository';
import { UserDataRepository } from './repositories/user-data.repository';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserDataRepository],
  exports: [UserService],
})
export class UsersModule {}
