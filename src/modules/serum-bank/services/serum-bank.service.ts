import { HttpException, Inject } from '@nestjs/common';
import { SerumBankRepository } from '../repositories/serum-bank.repository';
import { SerumBank } from '../entities/serum-bank.entity';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { PartialSerumBankDto } from '../dtos/partial-serum-bank.dto';
import { DefaultPaginationResponseDto } from 'src/common/dtos/default-pagination-response.dto';

export class SerumBankService {
  constructor(
    @Inject(SerumBankRepository)
    private readonly serumBankRepository: SerumBankRepository,
  ) {}

  async existsSerumBankByCode(code: string): Promise<boolean> {
    return this.serumBankRepository.existsBy({ serumBankCode: code });
  }

  async findAllSerumBank(
    page: number,
  ): Promise<{ SerumBanks: SerumBank[]; total: number }> {
    const [data, total] = await this.serumBankRepository.findAndCount({
      skip: (page - 1) * 10,
      take: 10,
    });
    return { SerumBanks: data, total };
  }
  async getSerumBankByCode(code: string): Promise<SerumBank> {
    if (!(await this.existsSerumBankByCode(code))) {
      throw new HttpException('Serum bank not found', 404);
    }
    return this.serumBankRepository.findOne({ where: { serumBankCode: code } });
  }

  async createSerumBank(
    serumBank: CreateSerumBankDto,
  ): Promise<PartialSerumBankDto> {
    if (await this.existsSerumBankByCode(serumBank.serumBankCode)) {
      throw new HttpException('Serum bank already exists', 409);
    }
    const createdSerumBank = await this.serumBankRepository.save(serumBank);

    return new PartialSerumBankDto(
      createdSerumBank.serumBankCode,
      createdSerumBank.capacity,
    );
  }
}
