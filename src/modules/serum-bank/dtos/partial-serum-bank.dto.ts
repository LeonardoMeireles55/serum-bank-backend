import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class PartialSerumBankDto {
  constructor(serumBankCode: string, capacity: number) {
    this.serumBankCode = serumBankCode;
    this.capacity = capacity;
  }

  @ApiProperty()
  @IsNotEmpty()
  serumBankCode: string;

  @ApiProperty()
  @IsNotEmpty()
  capacity: number;
}