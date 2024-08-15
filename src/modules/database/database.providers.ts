import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'root',
        database: 'postgres',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
        dropSchema: true,
        migrations: [`${__dirname}../../../migrations/{.ts,*.js}`],
        migrationsRun: false,
      });

      return dataSource.initialize();
    },
  },
];
