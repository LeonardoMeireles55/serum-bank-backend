import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { SerumBank } from '../entities/serum-bank.entity';
import { SerumBankService } from '../services/serum-bank.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/modules/authentication/guards/role.guard';
import { Public } from 'src/common/decorators/is-public.decorator';

@ApiTags('Serum-bank')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('api')
export class SerumBankController {
  constructor(private readonly serumBankService: SerumBankService) {}

  //   @Post()
  //   async create(
  //     @Body() createSerumBankDto: CreateSerumBankDto,
  //   ): Promise<SerumBank> {
  //     return this.serumBankService.create(createSerumBankDto);
  //   }

  //   @Get()
  //   async findAll(): Promise<SerumBank[]> {
  //     return this.serumBankService.findAll();
  //   }

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
