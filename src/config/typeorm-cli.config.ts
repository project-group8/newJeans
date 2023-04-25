import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import { Users } from '../entities/Users';
// import {} from 'typeorm-naming-strategies'
// import { Migrations1682398086430 } from 'src/migrations/1682398086430-migrations';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
