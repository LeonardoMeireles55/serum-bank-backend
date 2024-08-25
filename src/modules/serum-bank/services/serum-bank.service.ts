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

  async removeSample(sampleCode: string): Promise<void> {
    const sample = await this.samplesRepository.findOneBy({ sampleCode });
    console.log(sample)

    if (!sample) {
      throw new HttpException('Sample not found', 404);
    }

    const samplePosition = await this.samplesPositionsRepository
    .createQueryBuilder('samples_positions')
    .innerJoinAndSelect('samples_positions.sample', 'sample')
    .innerJoinAndSelect('samples_positions.serumBank', 'serum_bank') // Ensure serum_bank is joined
    .where('sample.id = :sampleId', { sampleId: sample.id })
    .getOne(); // Use getOne to get a single result

    console.log(samplePosition)

    if (!samplePosition) {
      throw new HttpException('Sample position not found', 404);
    }

    return this.dataSource.getConnection().transaction(async (manager) => {
      // Remove the sample position record
      await manager.getRepository(SamplePosition).remove(samplePosition);

      // Increase the available capacity of the serum bank
      const serumBank = samplePosition.serumBank;
      serumBank.availableCapacity++;
      await manager.getRepository(SerumBank).save(serumBank);

      // Optionally, remove the sample itself if no longer needed
      await manager.getRepository(Sample).remove(sample);
    });
  }

  private async findSerumBankByCodeOrThrow(code: string): Promise<SerumBank> {
    const serumBank = await this.getSerumBankByCode(code);
    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }
    return serumBank;
  }

  private ensureCapacity(serumBank: SerumBank): void {
    if (serumBank.capacity < 1) {
      throw new HttpException('Serum bank is full', 409);
    }
  }

  private async existSampleBySampleCode(code: string): Promise<boolean> {
    return await this.samplesRepository.existsBy({ sampleCode: code });
  }

  private async createSample(
    sampleCode: string,
    sampleType: string,
    manager: any,
  ): Promise<Sample> {
    if (await this.existSampleBySampleCode(sampleCode)) {
      throw new HttpException('Sample already exists', 409);
    }
    const sample = new Sample();
    sample.sampleCode = sampleCode;
    sample.sampleType = sampleType;
    return manager.getRepository(Sample).save(sample);
  }

  private async createSamplePosition(
    sample: Sample,
    serumBank: SerumBank,
    position: number,
    manager: any,
  ): Promise<SamplePosition> {
    const samplePosition = new SamplePosition();
    samplePosition.sample = sample;
    samplePosition.serumBank = serumBank;
    samplePosition.position = position;
    return manager.getRepository(SamplePosition).save(samplePosition);
  }

  private async decrementSerumBankCapacity(
    serumBank: SerumBank,
    manager: any,
  ): Promise<void> {
    serumBank.availableCapacity--;
    await manager.getRepository(SerumBank).save(serumBank);
  }

  async transactionalSerumBankRoutine(
    dto: TransactionalSerumBankDto,
  ): Promise<SamplePosition> {
    return this.dataSource.getConnection().transaction(async (manager) => {
      const serumBank = await this.findSerumBankByCodeOrThrow(
        dto.serumBankCode,
      );
      this.ensureCapacity(serumBank);

      const sample = await this.createSample(
        dto.sampleBarCode,
        dto.sampleType,
        manager,
      );
      const availablePosition = await this.getAvailablePosition(
        dto.serumBankCode,
      );

      const samplePosition = await this.createSamplePosition(
        sample,
        serumBank,
        availablePosition,
        manager,
      );

      await this.decrementSerumBankCapacity(serumBank, manager);

      return samplePosition;
    });
  }

  async getUsedPositions(serumBankCode: string): Promise<number[]> {
    const serumBank = await this.serumBankRepository.findOne({
      select: ['id'],
      where: { serumBankCode },
    });

    const usedPositions = await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .select(['samples_positions.position'])
      .where('samples_positions.serum_bank_id = :serumBankId', {
        serumBankId: serumBank.id,
      })
      .getMany();

    return usedPositions.map((item: any) => item.position);
  }

  async getAvailablePosition(serumBankCode: string): Promise<number> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }

    const capacity = serumBank.capacity;

    const usedPositions = await this.getUsedPositions(serumBankCode);

    const allPositions = Array.from({ length: capacity }, (_, index) => index);

    const availablePositions = allPositions.filter(
      (position) => !usedPositions.includes(position),
    );

    const availablePosition =
      availablePositions.length > 0 ? availablePositions[0] : -1;

    return availablePosition;
  }

  async getAllAvailablePositions(serumBankCode: string): Promise<number[]> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }

    const capacity = serumBank.capacity;

    const usedPositions = await this.getUsedPositions(serumBankCode);

    const allPositions = Array.from({ length: capacity }, (_, index) => index);

    const availablePositions = allPositions.filter(
      (position) => !usedPositions.includes(position),
    );

    return availablePositions;
  }

  async getAllSamplesFromSerumBank(code: string): Promise<SamplePosition[]> {
    if (!code) {
      throw new HttpException('Bad Request', 400);
    }
    const serumBank = await this.serumBankRepository.findOne({
      select: ['id'],
      where: { serumBankCode: code },
    });

    if (!serumBank) {
      throw new HttpException('Not found', 404);
    }

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

  async getAllSamplesFromSerumBankById(id: number): Promise<SamplePosition[]> {
    if (!id) {
      throw new HttpException('Bad Request', 400);
    }
    const serumBank = await this.serumBankRepository.findOne({
      select: ['id'],
      where: { id },
    });

    if (!serumBank) {
      throw new HttpException('Not found', 404);
    }

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

    if (!sample) {
      throw new HttpException('Sample not found', 404);
    }

    const position = await this.samplesPositionsRepository.query(
      `SELECT position, serum_bank_id FROM samples_positions WHERE sample_id = ${sample.id}`,
    );

    const serumBank = await this.serumBankRepository.findOneBy({
      id: position[0].serum_bank_id,
    });

    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }

    const positionSampleDto = new PositionSampleDto(
      position[0].position,
      serumBank.serumBankCode,
    );

    return positionSampleDto;
  }

  async existsSerumBankByCode(code: string): Promise<boolean> {
    return this.serumBankRepository.existsBy({ serumBankCode: code });
  }

  async updateSerumBankByCode(
    serumBankCode: string,
    updateSerumBankDto: UpdateSerumBankDto,
  ): Promise<SerumBank> {
    if (!(await this.existsSerumBankByCode(serumBankCode))) {
      throw new HttpException('Serum bank not found', 404);
    }

    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode: serumBankCode },
    });

    Object.assign(serumBank, updateSerumBankDto);

    return this.serumBankRepository.save(serumBank);
  }

  async findAllSerumBank(
    page: number,
  ): Promise<{ SerumBanks: SerumBank[]; total: number }> {
    const [data, total] = await this.serumBankRepository.findAndCount({
      order: { createdAt: 'ASC' },
      skip: (page - 1) * 10,
      take: 20,
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
