import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProfissionalPositionEnum } from '../enums/profissional-position.enum';

export class UpdateUserDto {
  constructor(phone: string, profissionalPosition: string) {
    this.phone = phone;
    this.profissionalPosition = profissionalPosition;
  }

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: ProfissionalPositionEnum })
  @IsNotEmpty()
  profissionalPosition: string;
}
