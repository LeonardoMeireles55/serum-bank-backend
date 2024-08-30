import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProfessionalPositionEnum } from '../enums/professional-position.enum';

export class UpdateUserDto {
  constructor(phone: string, profissionalPosition: string) {
    this.phone = phone;
    this.profissionalPosition = profissionalPosition;
  }

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: ProfessionalPositionEnum })
  @IsNotEmpty()
  profissionalPosition: string;
}
