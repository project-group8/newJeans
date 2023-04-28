import { Module } from '@nestjs/common';
import { ReplycommentsController } from './replycomments.controller';
import { ReplycommentsService } from './replycomments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyComments } from 'src/entities/ReplyComments.entity';
import mysqlDataSource from 'src/config/typeorm-cli.config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplyComments], mysqlDataSource),
    AuthModule,
    UsersModule,
  ],
  controllers: [ReplycommentsController],
  providers: [ReplycommentsService]
})
export class ReplycommentsModule {}
