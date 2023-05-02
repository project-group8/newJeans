import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Post,
  RequestMethod,
} from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { Chats } from '../entities/Chats.entity';
import { ChatSaves } from '../entities/ChatSaves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Chats, ChatSaves])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({ path: 'chat/hunsuChat', method: RequestMethod.POST });
    consumer
      .apply()
      .forRoutes({ path: 'chat/hunsuChat', method: RequestMethod.DELETE });
  }
}
