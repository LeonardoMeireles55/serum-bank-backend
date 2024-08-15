import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSerumBankDto {
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
