import { Database } from '../../../modules/database/database';
import { Repository } from 'typeorm';
import { Sample } from '../entities/samples.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SamplesRepository extends Repository<Sample> {
  constructor(dataSource: Database) {
    super(Sample, dataSource.getConnection().createEntityManager());
  }
}
