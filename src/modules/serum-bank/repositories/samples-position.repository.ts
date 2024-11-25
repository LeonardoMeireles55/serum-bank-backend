import { Repository } from 'typeorm';
import { SamplePosition } from '../entities/samples-positions.entity';
import { Database } from '../../../modules/database/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SamplesPositionRepository extends Repository<SamplePosition> {
  constructor(dataSource: Database) {
    super(SamplePosition, dataSource.getConnection().createEntityManager());
  }
}
