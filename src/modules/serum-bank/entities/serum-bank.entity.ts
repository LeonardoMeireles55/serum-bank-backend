import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { Exclude } from 'class-transformer';

@Entity({ name: 'serum_banks' })
export class SerumBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'serum_bank_code', unique: true })
  serumBankCode: string;

  @Column({ name: 'capacity', default: 100 })
  capacity: number;

  @Column({ name: 'available_capacity', default: 100 })
  availableCapacity: number;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updatedAt?: Date;

  constructor(createSerumBankDto?: CreateSerumBankDto) {
    if (createSerumBankDto) {
      this.serumBankCode = createSerumBankDto.serumBankCode;
      this.capacity = createSerumBankDto.capacity;
    }
  }
}
