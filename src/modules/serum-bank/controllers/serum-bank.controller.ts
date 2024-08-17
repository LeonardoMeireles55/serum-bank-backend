import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { SerumBank } from '../entities/serum-bank.entity';
import { SerumBankService } from '../services/serum-bank.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/authentication/guards/role.guard';
import { Public } from 'src/common/decorators/is-public.decorator';
import { PartialSerumBankDto } from '../dtos/partial-serum-bank.dto';
import { FullSerumBankDto } from '../dtos/full-serum-bank.dto';
import { DefaultPaginationResponseDto } from 'src/common/dtos/default-pagination-response.dto';
import { UpdateSerumBankDto } from '../dtos/update-serum-bank.dto';
import { TransactionalSerumBankDto } from '../dtos/transactional-serum-bank.dto';
import { SamplePosition } from '../entities/samples-positions.entity';
import { PositionSampleDto } from '../dtos/position-sample.dto';

@ApiTags('Serum-bank')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api')
export class SerumBankController {
  constructor(private readonly serumBankService: SerumBankService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: PartialSerumBankDto })
  @Public()
  @Post('create-serum-bank')
  async create(
    @Body() createSerumBankDto: CreateSerumBankDto,
  ): Promise<Partial<PartialSerumBankDto>> {
    return this.serumBankService.createSerumBank(createSerumBankDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: TransactionalSerumBankDto })
  @Public()
  @Post('transactional-routine-serum-bank')
  async transactionalRoutineSerumBank(
    @Body() transactionalSerumBankDto: TransactionalSerumBankDto,
  ): Promise<SamplePosition> {
    return this.serumBankService.transactionalSerumBankRoutine(
      transactionalSerumBankDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: DefaultPaginationResponseDto })
  @ApiQuery({ name: 'page', required: false })
  @Public()
  @Get('serum-banks')
  async getAllSerumBanks(
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
  @ApiResponse({ type: PositionSampleDto })
  @Public()
  @ApiQuery({ name: 'bank_code', required: true })
  @Get('availables-positions-bank')
  async getAvailablePositionsBySerumBankCode(
    @Query('bank_code') bank_code: string,
  ): Promise<number[]> {
    return await this.serumBankService.getAllAvailablePositions(bank_code);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PositionSampleDto })
  @Public()
  @ApiQuery({ name: 'sample_code', required: true })
  @Get('sample-position-barcode')
  async getSamplePositionByBarCode(
    @Query('sample_code') sample_code: string,
  ): Promise<PositionSampleDto> {
    const pos = await this.serumBankService.findSamplePosition(sample_code);
    console.log(pos);
    return pos;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: FullSerumBankDto })
  @ApiQuery({ name: 'code', required: true })
  @Public()
  @Get('serum-bank-by-code')
  async getSerumBankByCode(@Query('code') code: string): Promise<SerumBank> {
    return await this.serumBankService.getSerumBankByCode(code);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [SamplePosition] })
  @ApiQuery({ name: 'bank_code', required: true })
  @Public()
  @Get('samples-from-serum-bank')
  async getAllSamplesPositionFromSerumBank(
    @Query('bank_code') bankCode: string,
  ): Promise<SamplePosition[]> {
    return await this.serumBankService.getAllSamplesFromSerumBank(bankCode);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: FullSerumBankDto })
  @Put('update-serum-bank')
  async updateSerumBankByCode(
    @Body() updateSerumBankDto: UpdateSerumBankDto,
  ): Promise<SerumBank> {
    return this.serumBankService.updateSerumBankByCode(updateSerumBankDto);
  }

  //   @Delete(':id')
  //   async remove(@Param('id') id: string): Promise<void> {
  //     return this.serumBankService.remove(id);
  //   }
}
