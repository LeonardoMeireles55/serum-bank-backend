import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Database } from '../../../modules/database/database';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: Database) {
    super(User, dataSource.getConnection().createEntityManager());
  }
}
