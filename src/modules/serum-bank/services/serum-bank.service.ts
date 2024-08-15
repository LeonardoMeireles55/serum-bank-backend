import { HttpException, Inject } from '@nestjs/common';
import { SerumBankRepository } from '../repositories/serum-bank.repository';
import { SerumBank } from '../entities/serum-bank.entity';

export class SerumBankService {
  constructor(
    @Inject(SerumBankRepository)
    private readonly serumBankRepository: SerumBankRepository,
  ) {}

  async existsSerumBankByCode(code: string): Promise<boolean> {
    return this.serumBankRepository.existsBy({ serumBankCode: code });
  }

  async getSerumBankByCode(code: string): Promise<SerumBank> {
    if (!(await this.existsSerumBankByCode(code))) {
      throw new HttpException('Serum bank not found', 404);
    }
    return this.serumBankRepository.findOne({ where: { serumBankCode: code } });
  }
}
