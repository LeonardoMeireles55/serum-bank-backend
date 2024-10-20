import { Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './modules/users/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AppConfigModule } from './app-config/app-config.module';
import { SerumBankModule } from './modules/serum-bank/serum-bank.module';
import { AuthModule } from './modules/authentication/auth.module';
import { MigrationService } from './common/providers/migration.provider';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppConfigService } from './app-config/app-config.service';
import { StaticsModule } from './modules/statics/statics.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    UsersModule,
    SerumBankModule,
    DatabaseModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => ({
        transport: {
          host: config.emailHost,
          port: 587,
          secure: false,
          auth: {
            user: config.emailUser,
            pass: config.emailPass,
          },
        },
      }),
    }),
    StaticsModule,
  ],
  controllers: [],
  providers: [MigrationService],
})
export class AppModule implements OnModuleInit {
  constructor(private migrationService: MigrationService) {}

  async onModuleInit() {
    setTimeout(() => {}, 5000);
    await this.migrationService.onModuleInit();
  }
}
