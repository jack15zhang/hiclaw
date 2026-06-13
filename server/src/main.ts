import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
