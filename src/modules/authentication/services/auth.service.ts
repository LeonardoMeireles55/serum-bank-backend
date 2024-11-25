import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { TokenJwtDto } from '../dtos/token.jwt.dto';
import { AppConfigService } from '../../../app-config/app-config.service';
import { saltsOrRounds } from '../../../common/constants/salts-or-rounds.constants';
import { TokenCache } from '../../../common/utilities/token.cache.util';
import { UserService } from '../../../modules/users/services/users.service';

@Injectable()
export class AuthService {
  private tokenCache = TokenCache();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<TokenJwtDto> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, roles: user.typeAccess };

    // console.log(bcrypt.hashSync(password, SALTS_OR_ROUNDS));

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    // await this.userService.updateUserLastLogin(user.id);

    const token = new TokenJwtDto(
      await this.jwtService.signAsync(payload),
      this.appConfigService.jwtExpiresIn,
      user.id,
    );

    return token;
  }

  private async generateRecoveryToken(): Promise<string> {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  async recoverPasswordWithToken(
    email: string,
    token: string,
    newPassword: string,
  ) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryToken = this.tokenCache.get(email);

    if (recoveryToken !== token) {
      throw new BadRequestException('Token is incorrect');
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      throw new ConflictException('Password is the same as the current one');
    }

    const hashPass = await bcrypt.hash(newPassword, saltsOrRounds);
    user.password = hashPass;
    await this.userService.updateUserPassword(user.id, hashPass);
  }

  async recoveryToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const recoveryToken = await this.generateRecoveryToken();
    this.tokenCache.set(email, recoveryToken);

    try {
      // await this.mailService.sendMail({
      //   to: email,
      //   subject: 'Password Recovery',
      //   text: `Your recovery token is: ${recoveryToken}`
      // });

      return `your recovery token is: ${recoveryToken}`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
