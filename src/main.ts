import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { join } from 'path'; // Import join
import { AppConfigService } from './app-config/app-config.service'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

async function bootstrap() {
  // Use NestExpressApplication for static assets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(AppConfigService);

  // Serve static files from the 'public' directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/', // Serve files directly from the root (e.g., /scripts/login.js)
  });

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Serum-Bank API')
    .setDescription(
      'This project is a serum bank management system developed with the NestJS framework and TypeORM. The system is responsible for managing and processing serum samples in a database, including the creation, updating, and querying of information about serums and their positions.'
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.appPort);
}

bootstrap();
