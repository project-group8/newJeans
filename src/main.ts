import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
<<<<<<< HEAD
  const app = await NestFactory.create(AppModule);
=======
  const app = await NestFactory.create(AppModule, {cors:true});
  // const configService = app.get(ConfigService);
  // const DBhost = configService.get('DATABASE_URL');
  // const DBicon = configService.get('DATABASE_ICON');
>>>>>>> c62d493553741c8f1ff4306c3603b7b47063c7bd

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });

  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000);
}
bootstrap();
