import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ProfissionalPositionEnum } from './enums/profissional-position.enum';

@Entity({ name: 'users_data' })
export class UserData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 11 })
  phone: string;

  @Column({ name: 'profissional_position', enum: ProfissionalPositionEnum })
  profissionalPosition: string;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;
}
