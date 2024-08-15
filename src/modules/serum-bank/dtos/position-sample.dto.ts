import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PositionSampleDto {
  @ApiProperty()
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  @IsNotEmpty()
  serumBankCode: string;

  constructor(position: number, serumBankCode: string) {
    this.position = position;
    this.serumBankCode = serumBankCode;
  }
}
