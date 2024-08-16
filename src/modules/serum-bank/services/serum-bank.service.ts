import { HttpException, Inject } from '@nestjs/common';
import { SerumBankRepository } from '../repositories/serum-bank.repository';
import { SerumBank } from '../entities/serum-bank.entity';
import { CreateSerumBankDto } from '../dtos/create-serum-bank.dto';
import { PartialSerumBankDto } from '../dtos/partial-serum-bank.dto';
import { UpdateSerumBankDto } from '../dtos/update-serum-bank.dto';
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
        sample.sampleType = transactionalSerumBankDto.sampleType;

        const createdSample = await manager.getRepository(Sample).save(sample);
        const availablePosition = await this.getAvaliablePosition(
          transactionalSerumBankDto.serumBankCode,
        );

        samplesPositions.sample = createdSample;
        samplesPositions.serumBank = serumBank;
        samplesPositions.position = availablePosition;

        serumBank.availableCapacity--;

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

  async getUsedPositions(serumBankCode: string): Promise<number[]> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    const usedPositions = await this.samplesPositionsRepository.query(
      `SELECT position FROM samples_positions WHERE serum_bank_id = ${serumBank.id}`,
    );

    return usedPositions.map((item: any) => item.position);
  }

  async getAvaliablePosition(serumBankCode: string): Promise<number> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    const capacity = serumBank.capacity;

    const usedPositions = await this.getUsedPositions(serumBankCode);

    const allPositions = Array.from({ length: capacity }, (_, index) => index);

    const availablePositions = allPositions.filter(
      (position) => !usedPositions.includes(position),
    );

    console.log(availablePositions);

    const availablePosition =
      availablePositions.length > 0 ? availablePositions[0] : -1;

    console.log(availablePosition);
    return availablePosition;
  }

  async getAllSamplesFromSerumBank(code: string): Promise<SamplePosition[]> {
    if (!code) {
      throw new HttpException('Bad Request', 400);
    }
    const serumBank = await this.serumBankRepository.findOne({
      select: ['id'],
      where: { serumBankCode: code },
    });

    const samplePositions = await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .innerJoinAndSelect('samples_positions.sample', 'sample')
      .select(['sample.sampleCode', 'samples_positions.position'])
      .where('samples_positions.serum_bank_id = :serumBankId', {
        serumBankId: serumBank.id,
      })
      .getMany();

    return samplePositions;
  }

  async findSamplePosition(code: string): Promise<PositionSampleDto> {
    const sample = await this.samplesRepository.findOneBy({ sampleCode: code });

    const position = await this.samplesPositionsRepository.query(
      `SELECT position, serum_bank_id FROM samples_positions WHERE sample_id = ${sample.id}`,
    );

    const serumBank = await this.serumBankRepository.findOne({
      where: { id: position[0].serum_bank_id },
    });

    const positionSampleDto = new PositionSampleDto(
      position[0].position,
      serumBank.serumBankCode,
    );

    console.log(positionSampleDto);

    return positionSampleDto;
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
