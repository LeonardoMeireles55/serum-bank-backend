import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FullSerumBankDto {
  @ApiProperty()
  @IsNotEmpty()
  serumBankCode: string;

  @ApiProperty()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
