import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserData } from '../user-data.entity';
import { PartialUserDto } from '../dtos/partial-user-dto';
import { Database } from 'src/modules/database/database';
import { UserRepository } from '../repositories/user.repository';
import { UserDataRepository } from '../repositories/user-data.repository';

export class UserService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSouce: Database,
    private readonly userRepository: UserRepository,
    private readonly userDataRepository: UserDataRepository,
  ) {}

  async existByUserId(id: number): Promise<boolean> {
    return await this.userRepository.existsBy({ id });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUserPassword(id: number, password: string): Promise<User> {
    const user = await this.findUserById(id);

    user.password = password;

    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<PartialUserDto> {
    const user = new User(createUserDto);

    const response = await this.dataSouce
      .getConnection()
      .transaction(async (manager) => {
        const createdUser = manager.getRepository(User).save(user);

        const createdUserData = manager
          .getRepository(UserData)
          .save(user.userData);

        return { createdUser, createdUserData };
      });

    return (await response.createdUser).mapToPartialUserDto();
  }
}
