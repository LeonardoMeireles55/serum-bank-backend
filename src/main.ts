import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = (await NestFactory.create(AppConfigModule)).get(
    AppConfigService,
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Serum-Bank API')
    .setDescription('toDo')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.appPort || 3000);
}
bootstrap();
