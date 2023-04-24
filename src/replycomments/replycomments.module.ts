import { Module } from '@nestjs/common';
import { ReplycommentsController } from './replycomments.controller';
import { ReplycommentsService } from './replycomments.service';

@Module({
  controllers: [ReplycommentsController],
  providers: [ReplycommentsService]
})
export class ReplycommentsModule {}
