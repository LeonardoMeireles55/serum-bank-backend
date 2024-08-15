import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'samples' })
export class Sample {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sample_code' })
  sampleCode: string;

  @Column({
    name: 'sample_type',
    enum: ['blood', 'serum', 'plasma'],
    default: 'serum',
  })
  sampleType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
