import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PartialUserDto } from "./dtos/partial-user-dto";
import { UserData } from "./user-data.entity";
import { AccessEnum } from "./enums/acess.enum";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'type_access', enum: AccessEnum, default: AccessEnum.CLIENT })
  typeAccess: AccessEnum;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserData, (userData) => userData.id, {
    cascade: true,
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'users_data_id' })
  userData: UserData;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  mapToPartialUserDto(): PartialUserDto {
    return new PartialUserDto(
      this.email,
      this.userData.phone,
      this.userData.professionalPosition,
    );
  }

  constructor(createUserDto?: CreateUserDto) {
    if (createUserDto) {
      this.email = createUserDto.email;
      this.password = createUserDto.password;
      this.userData = new UserData();
      this.userData.phone = createUserDto.phone;
      this.userData.professionalPosition = createUserDto.professionalPosition;
    }
  }
}
