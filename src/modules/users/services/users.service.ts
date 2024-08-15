import { User } from '../user.entity';
import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserData } from '../user-data.entity';
import { PartialUserDto } from '../dtos/partial-user-dto';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { SALTS_OR_ROUNDS } from 'src/common/constants/salts-or-rounds.constants';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Database } from 'src/modules/database/database';

export class UserService {
  constructor(
    private readonly dataSource: Database,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
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

    user.password = await bcrypt.hash(user.password, SALTS_OR_ROUNDS);

    const response = await this.dataSource
      .getConnection()
      .transaction(async (manager) => {
        const createdUserData = await manager
          .getRepository(UserData)
          .save(user.userData);
        const createdUser = await manager.getRepository(User).save(user);

        return { createdUser, createdUserData };
      });

    return response.createdUser.mapToPartialUserDto();
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new ConflictException('Password is incorrect');
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      throw new ConflictException('Password is the same as the current one');
    }

    user.password = await bcrypt.hash(newPassword, SALTS_OR_ROUNDS);
    await this.userRepository.save(user);
  }

  async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, userDto);

    return this.userRepository.save(user);
  }
}
