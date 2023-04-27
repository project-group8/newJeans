import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatSplitValidPipe, CreateUserChatValidPipe } from './pipes/chat.pipe';
import {
  EnterUserChatDto,
  CreateUserChatDto,
  DeleteUserChatDto,
} from './dto/chat.dto';
import { Chats } from 'src/entities/Chats.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/hunsuChat')
  async chatRooms(
    @Query(ChatSplitValidPipe) enterUserChatDto: EnterUserChatDto,
  ): Promise<object> {
    const enterUserChat: object[] = await this.chatService.chatRooms(
      enterUserChatDto,
    );

    return { result: enterUserChat };
  }

  //
  //미완성
  //auth미들웨어 넣어야함
  @Post('/hunsuChat')
  async createUserChat(
    @Body(CreateUserChatValidPipe) createUserChatDto: CreateUserChatDto,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const createUserChat: Chats = await this.chatService.createUserChat(
      createUserChatDto,
    );
    createUserChat;
    return { msg: '채팅방 생성에 성공했습니다.' };
  }

  //
  //미완성
  //auth미들웨어 넣어야함
  @Delete('/hunsuChat/:roomName')
  async deleteUserChat(
    @Param('roomName') deleteUserChatDto: DeleteUserChatDto,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const chatDelete: void = await this.chatService.deleteUserChat(
      deleteUserChatDto,
    );
    chatDelete;
    return { msg: '채팅방 삭제에 성공했습니다.' };
  }

  @Get('/hunsuChat/admin/:roomName')
  async adminUserFind(@Param('roomName') roomName: string): Promise<object> {
    const adminUserFind: object = await this.chatService.adminUserFind(
      roomName,
    );

    return adminUserFind;
  }
}
