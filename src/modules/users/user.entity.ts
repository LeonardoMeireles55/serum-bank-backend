import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Expose, plainToClass } from 'class-transformer';
import { PartialUserDto } from './dtos/partial-user-dto';
import { UserData } from './user-data.entity';
import { AccessEnum } from './enums/acess.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => UserData, (userData) => userData.id, {
    cascade: false,
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'users_data_id' })
  @Expose({ name: 'users_data' })
  userData: UserData;

  @Column({ name: 'type_access', enum: AccessEnum, default: AccessEnum.CLIENT })
  @Expose({ name: 'type_access' })
  typeAccess: AccessEnum;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  mapToPartialUserDto(): PartialUserDto {
    return plainToClass(PartialUserDto, this);
  }

  constructor(createUserDto?: CreateUserDto) {
    if (createUserDto) {
      this.userData = new UserData();
      this.userData.phone = createUserDto.phone;
      this.email = createUserDto.email;
      this.password = createUserDto.password;
      this.userData.profissionalPosition = createUserDto.profissionalPosition;
    }
  }
}
