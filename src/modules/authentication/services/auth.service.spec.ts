import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenJwtDto } from '../dtos/token.jwt.dto';
import { AppConfigService } from '../../../app-config/app-config.service';
import { CreateUserDto } from '../../../modules/users/dtos/create-user.dto';
import { User } from '../../../modules/users/user.entity';
import { UserService } from '../../../modules/users/services/users.service';

describe('AuthService', () => {
  let service: AuthService;

  jest.useFakeTimers();

  const mockUserService = {
    findUserByEmail: jest.fn(),
    updateUserLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockJwtToken'),
    signAsync: jest.fn().mockReturnValue('mockJwtToken'),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockAppConfigService = {
    jwtSecret: 'mockJwtSecret',
    jwtExpiresIn: 18000,
  };

  const mockDataSource = {
    manager: {
      transaction: jest.fn().mockImplementation((cb) => cb()),
    },
  };

  const user: CreateUserDto = {
    id: 1,
    email: 'user@example.com',
    password: 'StrongPassword123!',
    phone: '555-555-5555',
    professionalPosition: 'Laboratory Technician',
  };

  const mockUser = new User(user);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailerService, useValue: mockMailerService },
        { provide: DataSource, useValue: mockDataSource },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should return jwt token and expires ', async () => {
    mockUserService.findUserByEmail.mockResolvedValue(mockUser);
    mockUserService.updateUserLastLogin.mockResolvedValue(undefined);

    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    const token = await service.signIn(user.email, user.password);

    const expectedToken: TokenJwtDto = new TokenJwtDto(
      'mockJwtToken',
      18000,
      1,
    );

    expect(token).toBeDefined();
    expect(token).toMatchObject(expectedToken);
  });
});
