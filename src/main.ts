import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });

  app.setGlobalPrefix('api');
  // app.useWebSocketAdapter(new SocketIoAdapter(app));
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3003);
}
bootstrap();
