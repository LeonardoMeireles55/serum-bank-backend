import { Database } from '../../../modules/database/database';
import { SerumBank } from '../entities/serum-bank.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SerumBankRepository extends Repository<SerumBank> {
  constructor(dataSource: Database) {
    super(SerumBank, dataSource.getConnection().createEntityManager());
  }
}
