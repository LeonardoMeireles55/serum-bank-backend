import { Module } from '@nestjs/common';
import { StaticsController } from './statics.controller';

@Module({
  controllers: [StaticsController],
})
export class StaticsModule {}
