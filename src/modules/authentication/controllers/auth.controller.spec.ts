import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginDto } from '../dtos/login.dto';
import { BadRequestException } from '@nestjs/common';
import { RecoverPasswordDto } from '../dtos/recoverPassword.dto';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/users/services/users.service';
import { User } from 'src/modules/users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    recoveryToken: jest.fn(),
  };

  const mockUserService = {
    findUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login', async () => {
    const signInDto = new LoginDto('leo@email.com', '123456Leo@');

    mockAuthService.signIn.mockImplementation(async () => {
      return { accessToken: 'token' };
    });

    await controller.signIn(signInDto);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      signInDto.email,
      signInDto.password,
    );
  });

  it('sign in throw error', async () => {
    const signInDto = new LoginDto('', '');

    mockAuthService.signIn.mockImplementation(async () => {
      throw new BadRequestException();
    });

    const loginControllerError = controller.signIn(signInDto);

    expect(mockAuthService.signIn).rejects.toThrow(new BadRequestException());
    await expect(controller.signIn(signInDto)).rejects.toThrow();
    await expect(loginControllerError).rejects.toThrow();
  });

  it('reset-password', async () => {
    const recoverPasswordDto = new RecoverPasswordDto('leo@email.com');

    mockAuthService.recoveryToken.mockImplementation(async () => {
      return { accessToken: 'token' };
    });

    mockUserService.findUserByEmail.mockImplementation(async () => {
      return new User();
    });

    await controller.recoverPassword(recoverPasswordDto);

    expect(mockAuthService.recoveryToken).toHaveBeenCalledWith(
      recoverPasswordDto.email,
    );
    expect(mockUserService.findUserByEmail).toHaveBeenCalled();
  });
});
