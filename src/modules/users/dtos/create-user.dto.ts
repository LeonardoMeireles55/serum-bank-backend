import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { ProfissionalPositionEnum } from '../enums/profissional-position.enum';

export class CreateUserDto {
  id?: number;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: ProfissionalPositionEnum })
  @IsNotEmpty()
  profissionalPosition: string;
}
