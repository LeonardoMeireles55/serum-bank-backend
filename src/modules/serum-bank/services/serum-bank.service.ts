import { HttpException, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { EntityManager } from 'typeorm';
import { Database } from "../../../modules/database/database";
import { CreateSerumBankDto } from "../dtos/create-serum-bank.dto";
import { PartialSerumBankDto } from "../dtos/partial-serum-bank.dto";
import { PositionSampleDto } from "../dtos/position-sample.dto";
import { TransactionalSerumBankDto } from "../dtos/transactional-serum-bank.dto";
import { UpdateSerumBankDto } from "../dtos/update-serum-bank.dto";
import { SamplePosition } from "../entities/samples-positions.entity";
import { Sample } from "../entities/samples.entity";
import { SerumBank } from "../entities/serum-bank.entity";
import { SamplesPositionRepository } from "../repositories/samples-position.repository";
import { SamplesRepository } from "../repositories/samples.repository";
import { SerumBankRepository } from "../repositories/serum-bank.repository";

export class SerumBankService {

  private readonly logger = new Logger(SerumBankService.name);
  
  constructor(
    @Inject(SerumBankRepository)
    private readonly serumBankRepository: SerumBankRepository,
    @Inject(SamplesRepository)
    private readonly samplesRepository: SamplesRepository,
    @Inject(SamplesPositionRepository)
    private readonly samplesPositionsRepository: SamplesPositionRepository,
    private readonly dataSource: Database,
  ) {}

  private async findSerumBanksWith7Days(): Promise<SerumBank[]> {
    const sevenDaysAgo = new Date().setDate(new Date().getDate() - 7);

    return this.serumBankRepository
      .createQueryBuilder('serum_bank')
      .where('serum_bank.updatedAt <= :sevenDaysAgo', { sevenDaysAgo })
      .getMany();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkSerumBanksCreated7DaysAgo() {
    
    this.logger.log('Checking serum banks created 7 days ago');
    const serumBanks = await this.findSerumBanksWith7Days();

    if (serumBanks.length > 0) {
      serumBanks.forEach(serumBank => {
        if(serumBank.availableCapacity < 100) {
          this.removeAllSamplesFromSerumBank(serumBank.serumBankCode)
        }
      });
    }
  }

  private async removeSampleAndPosition(manager: EntityManager, sample: Sample, samplePosition: SamplePosition): Promise<void> {
    await manager.getRepository(SamplePosition).remove(samplePosition);
    await manager.getRepository(Sample).remove(sample);

    const serumBank = samplePosition.serumBank;
    serumBank.availableCapacity++;
    await manager.getRepository(SerumBank).save(serumBank);
  }

  private async removeAllSamplesAndUpdateCapacity(manager: EntityManager, serumBank: SerumBank, samplePositions: SamplePosition[]): Promise<void> {
    for (const samplePosition of samplePositions) {
      await manager.getRepository(SamplePosition).remove(samplePosition);
      await manager.getRepository(Sample).remove(samplePosition.sample);
      serumBank.availableCapacity++;
    }
    await manager.getRepository(SerumBank).save(serumBank);
  }

  async removeSample(sampleCode: string): Promise<void> {
    const sample = await this.samplesRepository.findOneBy({ sampleCode });

    if (!sample) {
      throw new HttpException('Sample not found', 404);
    }

    const samplePosition = await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .innerJoinAndSelect('samples_positions.sample', 'sample')
      .innerJoinAndSelect('samples_positions.serumBank', 'serum_bank')
      .where('sample.id = :sampleId', { sampleId: sample.id })
      .getOne();

    if (!samplePosition) {
      throw new HttpException('Sample position not found', 404);
    }

    return this.dataSource.getConnection().transaction(async (manager) => {
      await this.removeSampleAndPosition(manager, sample, samplePosition);
    });
  }

  async removeAllSamplesFromSerumBank(serumBankCode: string): Promise<void> {
    try {
      const serumBank = await this.findSerumBankByCodeOrThrow(serumBankCode);
    
      const samplePositions = await this.samplesPositionsRepository
        .createQueryBuilder('samples_positions')
        .innerJoinAndSelect('samples_positions.sample', 'sample')
        .where('samples_positions.serum_bank_id = :serumBankId', {
          serumBankId: serumBank.id,
        })
        .getMany();
        
      // Se não há amostras, atualizamos apenas a capacidade disponível
      if (samplePositions.length === 0) {
        // Garantir que a capacidade disponível está correta
        serumBank.availableCapacity = serumBank.capacity;
        await this.serumBankRepository.save(serumBank);
        this.logger.log(`No samples found in serum bank ${serumBankCode}. Capacity reset.`);
        return;
      }
    
      return this.dataSource.getConnection().transaction(async (manager) => {
        await this.removeAllSamplesAndUpdateCapacity(manager, serumBank, samplePositions);
        this.logger.log(`Removed ${samplePositions.length} samples from serum bank ${serumBankCode}`);
      });
            
    } catch(error) {
      this.logger.error(`Failed to remove samples from serum bank ${serumBankCode}: ${error.message}`, error.stack);
      throw new HttpException(`Failed to remove samples: ${error.message}`, 500);
    }
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
    manager: EntityManager,
  ): Promise<Sample> {
    if (await this.existSampleBySampleCode(sampleCode)) {
      throw new HttpException('Sample already exists', 409);
    }
    const sample = new Sample(sampleCode, sampleType);

    return manager.getRepository(Sample).save(sample);
  }

  private async createSamplePosition(
    sample: Sample,
    serumBank: SerumBank,
    position: number,
    manager: EntityManager,
  ): Promise<SamplePosition> {
    const samplePosition = new SamplePosition();
    samplePosition.sample = sample;
    samplePosition.serumBank = serumBank;
    samplePosition.position = position;
    return manager.getRepository(SamplePosition).save(samplePosition);
  }

  private async decrementSerumBankCapacity(
    serumBank: SerumBank,
    manager: EntityManager,
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

    if (!serumBank) {
      throw new HttpException(`Serum bank with code ${serumBankCode} not found`, 404);
    }

    const usedPositions = await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .select(['samples_positions.position'])
      .where('samples_positions.serum_bank_id = :serumBankId', {
        serumBankId: serumBank.id,
      })
      .getMany();

    return usedPositions.map((item: SamplePosition) => item.position);
  }

  async getAvailablePosition(serumBankCode: string): Promise<number> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }

    const capacity = serumBank.capacity;

    const usedPositions = new Set(await this.getUsedPositions(serumBankCode));

    const allPositions = Array.from({ length: capacity }, (_, index) => index);

    const availablePositions = allPositions.filter(
      (position) => !usedPositions.has(position),
    );

    return availablePositions.length > 0 ? availablePositions[0] : -1;

  }

  async getAllAvailablePositions(serumBankCode: string): Promise<number[]> {
    const serumBank = await this.serumBankRepository.findOne({
      where: { serumBankCode },
    });

    if (!serumBank) {
      throw new HttpException('Serum bank not found', 404);
    }

    const capacity = serumBank.capacity;

    const usedPositions = new Set(await this.getUsedPositions(serumBankCode));

    const allPositions = Array.from({ length: capacity }, (_, index) => index);

    return allPositions.filter((position) => !usedPositions.has(position));
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

    return await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .innerJoinAndSelect('samples_positions.sample', 'sample')
      .select(['sample.sampleCode', 'samples_positions.position'])
      .where('samples_positions.serum_bank_id = :serumBankId', {
        serumBankId: serumBank.id,
      })
      .getMany();
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

    return await this.samplesPositionsRepository
      .createQueryBuilder('samples_positions')
      .innerJoinAndSelect('samples_positions.sample', 'sample')
      .select([
        'sample.sampleType',
        'sample.sampleCode',
        'samples_positions.position',
      ])
      .where('samples_positions.serum_bank_id = :serumBankId', {
        serumBankId: serumBank.id,
      })
      .getMany();
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

    return new PositionSampleDto(
      position[0].position,
      serumBank.serumBankCode,
    );
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
