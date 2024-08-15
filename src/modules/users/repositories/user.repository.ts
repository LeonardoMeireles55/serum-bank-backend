import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@Inject('DATA_SOURCE') dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
