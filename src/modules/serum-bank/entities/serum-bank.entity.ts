import { User } from 'src/modules/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { Exclude } from 'class-transformer';

@Entity({ name: 'serum_banks' })
export class SerumBank {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'user_id' })
  // userId: User;

  @Column({ name: 'serum_bank_code', unique: true })
  serumBankCode: string;

  @Column({ name: 'capacity', default: 100 })
  capacity: number;

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
