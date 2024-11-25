import { AppConfigService } from '../../app-config/app-config.service';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [AppConfigService],
    useFactory: async (config: AppConfigService) => {
      const dataSource = new DataSource({
        type: 'sqlite',
        // host: config.dbHost,
        // port: config.dbPort,
        // username: config.dbUsername,
        // password: config.dbPassword,
        database: config.dbDatabase,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: config.nodeEnv === 'development' ? true : false,
        logging: config.nodeEnv === 'development' ? true : false,
        dropSchema: config.nodeEnv === 'development' ? true : false,
        migrations: [`${__dirname}../../../migrations/{.ts,*.js}`],
        migrationsRun: false,
      });

      return dataSource.initialize();
    },
  },
];
