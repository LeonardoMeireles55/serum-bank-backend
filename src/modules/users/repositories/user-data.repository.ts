import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserData } from '../user-data.entity';
import { Database } from 'src/modules/database/database';

@Injectable()
export class UserDataRepository extends Repository<UserData> {
  constructor(dataSource: Database) {
    super(User, dataSource.getConnection().createEntityManager());
  }
}
