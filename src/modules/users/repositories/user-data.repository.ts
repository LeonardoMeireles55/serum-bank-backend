import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserData } from '../user-data.entity';

@Injectable()
export class UserDataRepository extends Repository<UserData> {
  constructor(@Inject('DATA_SOURCE') dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
