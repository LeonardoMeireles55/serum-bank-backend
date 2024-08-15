import { ApiProperty } from '@nestjs/swagger';

export class DefaultPaginationResponseDto {
  @ApiProperty()
  response: any | any[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  status: boolean;

  constructor(response: any, page: number, total: number, items: boolean) {
    this.response = response;
    this.page = page;
    this.total = total;
    this.status = items;
  }
}
