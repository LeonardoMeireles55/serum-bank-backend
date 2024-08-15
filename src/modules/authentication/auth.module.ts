import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './guards/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { RolesGuard } from './guards/role.guard';
import { UsersModule } from '../users/user.module';
import { User } from '../users/user.entity';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
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
    DatabaseModule,
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
