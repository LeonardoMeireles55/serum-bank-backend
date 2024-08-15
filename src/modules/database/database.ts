import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class Database {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  getConnection() {
    return this.dataSource;
  }
}
