import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  //   constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['src/entities/**/*.ts'],
      synchronize: false, // false로 해두는 게 안전하다.
      timezone: 'Asia/Seoul',
      migrations: ['src/migration/**/*.ts'],
    };
  }
}
