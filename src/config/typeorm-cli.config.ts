import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Users } from 'src/entities/Users.entity';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { Chats } from 'src/entities/Chats.entity';
import { ChatSaves } from 'src/entities/ChatSaves.entity';
import { CommentLikes } from 'src/entities/CommentLikes.entity';
import { Comments } from 'src/entities/Comments.entity';
import { PostLikes } from 'src/entities/PostLikes.entity';
import { Prefers } from 'src/entities/Prefers.entity';
import { ReplyComments } from 'src/entities/ReplyComments.entity';
import { Tokens } from 'src/entities/Tokens.entity';

// import { Migrations1682398086430 } from 'src/migrations/1682398086430-migrations';

config();

const configService = new ConfigService();

// export default new DataSource({
//   type: 'mysql',
//   host: configService.get<string>('DB_HOST'),
//   port: configService.get<number>('DB_PORT'),
//   username: configService.get<string>('DB_USERNAME'),
//   password: configService.get<string>('DB_PASSWORD'),
//   database: configService.get<string>('DB_NAME'),
//   entities: ['src/entities/*.ts'],
//   migrations: ['src/migrations/*.ts'],
//   migrationsTableName: 'migrations',
// });

const mysqlDataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    Users,
    CardPosts,
    Chats,
    ChatSaves,
    CommentLikes,
    Comments,
    PostLikes,
    Prefers,
    ReplyComments,
    Tokens
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default mysqlDataSource;
