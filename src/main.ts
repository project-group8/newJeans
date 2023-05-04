import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: true,
    // credentials: true,
    // exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ['Authorization'],
  });

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
