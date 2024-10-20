import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
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
import { HateoasInterceptor } from 'src/common/interceptors/hateos.interceptors';

@ApiTags('Serum Banks')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller({ version: '1', path: 'serum-banks' })
export class SerumBankController {
  constructor(private readonly serumBankService: SerumBankService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [SamplePosition] })
  @Public()
  @Get('samples')
  @ApiResponse({ type: [SamplePosition] })
  @ApiQuery({ name: 'id', type: Number, required: true })
  async getAllSamplesPositionFromSerumBankById(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<SamplePosition[]> {
    return this.serumBankService.getAllSamplesFromSerumBankById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: PartialSerumBankDto })
  @Public()
  @UseInterceptors(HateoasInterceptor)
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
  @UseInterceptors(HateoasInterceptor)
  @Get()
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
  @ApiResponse({ type: FullSerumBankDto })
  @Public()
  @Get(':code')
  async getSerumBankByCode(@Param('code') code: string): Promise<SerumBank> {
    return this.serumBankService.getSerumBankByCode(code);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [SamplePosition] })
  @Public()
  @Get(':code/samples')
  async getAllSamplesPositionFromSerumBank(
    @Param('code') bankCode: string,
  ): Promise<SamplePosition[]> {
    return this.serumBankService.getAllSamplesFromSerumBank(bankCode);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PositionSampleDto })
  @Public()
  @Get(':code/available-positions')
  async getAvailablePositionsBySerumBankCode(
    @Param('code') bankCode: string,
  ): Promise<number[]> {
    return this.serumBankService.getAllAvailablePositions(bankCode);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PositionSampleDto })
  @Public()
  @Get('samples/:sampleCode/position')
  async getSamplePositionByBarCode(
    @Param('sampleCode') sampleCode: string,
  ): Promise<PositionSampleDto> {
    return this.serumBankService.findSamplePosition(sampleCode);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: TransactionalSerumBankDto })
  @Post('transaction')
  async transactionalRoutineSerumBank(
    @Body() transactionalSerumBankDto: TransactionalSerumBankDto,
  ): Promise<SamplePosition> {
    return this.serumBankService.transactionalSerumBankRoutine(
      transactionalSerumBankDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: FullSerumBankDto })
  @Put(':code')
  async updateSerumBankByCode(
    @Param('code') code: string,
    @Body() updateSerumBankDto: UpdateSerumBankDto,
  ): Promise<SerumBank> {
    return this.serumBankService.updateSerumBankByCode(
      code,
      updateSerumBankDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @Delete('/samples/:serumBankCode/allSamples')
  async removeAllSamples(@Param('serumBankCode') serumBankCode: string): Promise<void> {
    console.log(serumBankCode)
    return this.serumBankService.removeAllSamplesFromSerumBank(serumBankCode);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @Delete('/samples/:sampleCode')
  async remove(@Param('sampleCode') sampleCode: string): Promise<void> {
    return this.serumBankService.removeSample(sampleCode);
  }


}
