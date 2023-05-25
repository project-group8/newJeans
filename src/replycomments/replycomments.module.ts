import { Module } from '@nestjs/common';
import { ReplycommentsController } from './replycomments.controller';
import { ReplycommentsService } from './replycomments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyComments } from '../entities/ReplyComments.entity';
import mysqlDataSource from '../config/typeorm-cli.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplyComments], mysqlDataSource),
    AuthModule,
    UsersModule,
  ],
  controllers: [ReplycommentsController],
  providers: [ReplycommentsService],
})
export class ReplycommentsModule {}
