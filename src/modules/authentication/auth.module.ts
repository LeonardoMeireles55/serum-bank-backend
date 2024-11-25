import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { RolesGuard } from './guards/role.guard';
import { UsersModule } from '../users/user.module';
import { AppConfigModule } from '../../app-config/app-config.module';
import { AppConfigService } from '../../app-config/app-config.service';
import { DatabaseModule } from '../database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    DatabaseModule,
    MailerModule,
    AppConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, RolesGuard],
})
export class AuthModule {}
