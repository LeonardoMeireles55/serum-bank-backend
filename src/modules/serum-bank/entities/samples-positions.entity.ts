import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sample } from './samples.entity';
import { SerumBank } from './serum-bank.entity';

@Entity({ name: 'samples_positions' })
export class SamplePosition {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Sample, (sample) => sample.id)
  @JoinColumn({ name: 'sample_id' })
  sampleId: Sample;

  @ManyToOne(() => SerumBank, (serumBank) => serumBank.id)
  @JoinColumn({ name: 'serum_bank_id' })
  serumBankId: SerumBank;
}
