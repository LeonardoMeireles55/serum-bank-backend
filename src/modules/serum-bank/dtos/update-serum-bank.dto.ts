import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSerumBankDto {
  constructor(serumBankCode: string, capacity: number) {
    this.capacity = capacity;
  }

  @ApiProperty()
  @IsNotEmpty()
  capacity: number;
}
