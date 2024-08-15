import {
  Body,
  Controller,
  Get,
  HttpCode,
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
@Controller('api')
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

    const response = new DefaultResponseDto(
      token,
      'User logged in successfully',
      true,
    );

    return response;
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

    const token = await this.authService.recoveryToken(
      recoverPasswordDto.email,
    );

    const response = new DefaultResponseDto(
      token,
      'Token generated successfully',
      true,
    );

    return response;
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

    await this.authService.recoverPasswordWithToken(
      recoverPasswordWithTokenDto.email,
      recoverPasswordWithTokenDto.token,
      recoverPasswordWithTokenDto.new_password,
    );
    const response = new DefaultResponseDto(
      'Password changed successfully',
      'Password changed successfully',
      true,
    );

    return response;
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req): any {
    return req.user;
  }
}
