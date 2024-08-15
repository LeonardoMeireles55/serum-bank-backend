import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { User } from 'src/modules/users/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub } = payload;
    const user: User = await this.userRepository.findOne({
      select: ['id', 'password', 'typeAccess'],
      where: { id: sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
