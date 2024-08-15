import { ApiProperty } from '@nestjs/swagger';
import { SampleTypeEnum } from '../enums/sample-type.enum';
import { IsNotEmpty } from 'class-validator';

export class TransactionalSerumBankDto {
  @ApiProperty()
  @IsNotEmpty()
  sampleBarCode: string;

  @ApiProperty({ enum: SampleTypeEnum, default: SampleTypeEnum.SERUM })
  @IsNotEmpty()
  sampleType: string;

  @ApiProperty()
  @IsNotEmpty()
  serumBankCode: string;
}
