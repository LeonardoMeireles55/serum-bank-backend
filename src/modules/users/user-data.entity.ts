import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProfessionalPositionEnum } from './enums/professional-position.enum';

@Entity({ name: 'users_data' })
export class UserData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 11 })
  phone: string;

  @Column({ name: 'professional_position', enum: ProfessionalPositionEnum })
  professionalPosition: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
