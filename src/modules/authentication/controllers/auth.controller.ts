import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RecoverPasswordDto } from '../dtos/recoverPassword.dto';
import { RecoverPasswordWithTokenDto } from '../dtos/recoverPasswordWithToken.dto';
import { AuthService } from '../services/auth.service';
import { HandleErrors } from 'src/common/decorators/handle-errors.decorator';
import { Public } from 'src/common/decorators/is-public.decorator';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { UserService } from 'src/modules/users/services/users.service';

@ApiTags('Auth')
@Controller({ version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiBody({ type: LoginDto })
  @Post('login')
  @HandleErrors()
  async signIn(@Body() signInDto: LoginDto): Promise<DefaultResponseDto> {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return new DefaultResponseDto(token, 'User logged in successfully', true);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password')
  @HandleErrors()
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<DefaultResponseDto> {
    const user = await this.userService.findUserByEmail(
      recoverPasswordDto.email,
    );

    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.authService.recoveryToken(
      recoverPasswordDto.email,
    );

    return new DefaultResponseDto(token, 'Token generated successfully', true);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('recover-password')
  @HandleErrors()
  async recoverPasswordWithToken(
    @Body() recoverPasswordWithTokenDto: RecoverPasswordWithTokenDto,
  ): Promise<DefaultResponseDto> {
    const user = await this.userService.findUserByEmail(
      recoverPasswordWithTokenDto.email,
    );

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.authService.recoverPasswordWithToken(
      recoverPasswordWithTokenDto.email,
      recoverPasswordWithTokenDto.token,
      recoverPasswordWithTokenDto.new_password,
    );
    return new DefaultResponseDto(
      'Password changed successfully',
      'Password changed successfully',
      true,
    );
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req): any {
    return req.user;
  }
}
