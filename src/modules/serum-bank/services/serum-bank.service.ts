import { HttpException, Inject } from '@nestjs/common';
import { SerumBankRepository } from '../repositories/serum-bank.repository';
import { SerumBank } from '../entities/serum-bank.entity';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { PartialSerumBankDto } from '../dtos/partial-serum-bank.dto';
import { UpdateSerumBankDto } from '../dtos/update-serum-bank.dto';
import { FullSerumBankDto } from '../dtos/full-serum-bank.dto';
import { Database } from 'src/modules/database/database';
import { TransactionalSerumBankDto } from '../dtos/transactional-serum-bank.dto';
import { Sample } from '../entities/samples.entity';
import { SamplePosition } from '../entities/samples-positions.entity';
import { SamplesRepository } from '../repositories/samples.repository';
import { SamplesPositionRepository } from '../repositories/samples-position.repository';
import { PositionSampleDto } from '../dtos/position-sample.dto';

export class SerumBankService {
  constructor(
    @Inject(SerumBankRepository)
    private readonly serumBankRepository: SerumBankRepository,
    @Inject(SamplesRepository)
    private readonly samplesRepository: SamplesRepository,
    @Inject(SamplesPositionRepository)
    private readonly samplesPositionsRepository: SamplesPositionRepository,
    private readonly dataSource: Database,
  ) {}

  async transactionalSerumBankRoutine(
    transactionalSerumBankDto: TransactionalSerumBankDto,
  ) {
    const response = await this.dataSource
      .getConnection()
      .transaction(async (manager) => {
        const serumBank = await this.getSerumBankByCode(
          transactionalSerumBankDto.serumBankCode,
        );

        if (serumBank.capacity < 1) {
          throw new HttpException('Serum bank is Full', 409);
        }

        const sample = new Sample();

        const samplesPositions = new SamplePosition();

        sample.sampleCode = transactionalSerumBankDto.sampleBarCode;
        console.log(transactionalSerumBankDto.sampleBarCode);
        sample.sampleType = transactionalSerumBankDto.sampleType;

        const createdSample = await manager.getRepository(Sample).save(sample);

        samplesPositions.sampleId = createdSample;
        samplesPositions.serumBankId = serumBank;
        samplesPositions.position = serumBank.capacity;

        serumBank.capacity--;

        const createdSamplePositions = manager
          .getRepository(SamplePosition)
          .save(samplesPositions);

        const updatedSerumBank = await manager
          .getRepository(SerumBank)
          .save(serumBank);

        return createdSamplePositions;
      });

    return response;
  }

  async findSamplePosition(code: string): Promise<PositionSampleDto> {
    const sample = await this.samplesRepository.findOneBy({ sampleCode: code });
    console.log(sample);
    const position = await this.samplesPositionsRepository.findOneBy({
      sampleId: sample.id,
    });
    console.log(position);

    return new PositionSampleDto(
      position.position,
      position.serumBankId.serumBankCode,
    );
  }

  async existsSerumBankByCode(code: string): Promise<boolean> {
    return this.serumBankRepository.existsBy({ serumBankCode: code });
  }

  async updateSerumBankByCode(
    updateSerumBankDto: UpdateSerumBankDto,
  ): Promise<SerumBank> {
    if (!(await this.existsSerumBankByCode(updateSerumBankDto.serumBankCode))) {
      throw new HttpException('Serum bank not found', 404);
    }

    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode: updateSerumBankDto.serumBankCode },
    });

    Object.assign(serumBank, updateSerumBankDto);

    return this.serumBankRepository.save(serumBank);
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
    return await this.serumBankRepository.findOne({
      where: { serumBankCode: code },
    });
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
