import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { SerumBank } from '../entities/serum-bank.entity';
import { SerumBankService } from '../services/serum-bank.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/authentication/guards/role.guard';
import { Public } from 'src/common/decorators/is-public.decorator';
import { PartialSerumBankDto } from '../dtos/partial-serum-bank.dto';
import { FullSerumBankDto } from '../dtos/full-serum-bank.dto';
import { DefaultPaginationResponseDto } from 'src/common/dtos/default-pagination-response.dto';

@ApiTags('Serum-bank')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api')
export class SerumBankController {
  constructor(private readonly serumBankService: SerumBankService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: PartialSerumBankDto })
  @Public()
  @Post()
  async create(
    @Body() createSerumBankDto: CreateSerumBankDto,
  ): Promise<Partial<PartialSerumBankDto>> {
    return this.serumBankService.createSerumBank(createSerumBankDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: DefaultPaginationResponseDto })
  @ApiQuery({ name: 'page', required: false })
  @Public()
  @Get('find-all')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ): Promise<DefaultPaginationResponseDto> {
    const response = await this.serumBankService.findAllSerumBank(page);

    return new DefaultPaginationResponseDto(
      response.SerumBanks,
      page,
      response.total,
      true,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: FullSerumBankDto })
  @Public()
  @Get(':bar_code')
  async findOneSerumBankByCode(
    @Param('bar_code') BarCode: string,
  ): Promise<SerumBank> {
    return this.serumBankService.getSerumBankByCode(BarCode);
  }

  //   @Put(':id')
  //   async update(
  //     @Param('id') id: string,
  //     @Body() updateSerumBankDto: UpdateSerumBankDto,
  //   ): Promise<SerumBank> {
  //     return this.serumBankService.update(id, updateSerumBankDto);
  //   }

  //   @Delete(':id')
  //   async remove(@Param('id') id: string): Promise<void> {
  //     return this.serumBankService.remove(id);
  //   }
}
