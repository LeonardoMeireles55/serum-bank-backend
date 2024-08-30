import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { User } from 'src/modules/users/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub } = payload;
    const user: User = await this.dataSource.getRepository(User).findOne({
      select: ['id', 'password', 'typeAccess'],
      where: { id: sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
