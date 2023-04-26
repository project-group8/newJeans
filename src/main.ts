import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // const DBhost = configService.get('DATABASE_URL');
  // const DBicon = configService.get('DATABASE_ICON');

  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3001);
  // console.log(DBicon);
  // console.log(DBhost);
  // console.log(DBicon);
}
bootstrap();
