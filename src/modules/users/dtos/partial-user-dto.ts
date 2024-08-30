import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { ProfessionalPositionEnum } from '../enums/professional-position.enum';

export class PartialUserDto {
  constructor(email: string, phone: string, profissionalPosition: string) {
    this.email = email;
    this.phone = phone;
    this.profissionalPosition = profissionalPosition;
  }

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Exclude()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: ProfessionalPositionEnum })
  @IsNotEmpty()
  profissionalPosition: string;
}
