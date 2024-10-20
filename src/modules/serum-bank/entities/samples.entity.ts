import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SampleTypeEnum } from '../enums/sample-type.enum';


@Entity({ name: 'samples' })
export class Sample {

  constructor(sampleCode: string, sampleType: string) {
    this.sampleCode = sampleCode;
    this.sampleType = sampleType;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sample_code', unique: true })
  sampleCode: string;

  @Column({
    name: 'sample_type',
    enum: SampleTypeEnum,
    default: SampleTypeEnum.SERUM,
  })
  sampleType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

}
