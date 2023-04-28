import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatSplitValidPipe, CreateUserChatValidPipe } from './pipes/chat.pipe';
import { EnterUserChatDto, CreateUserChatDto } from './dto/chat.dto';
import { Chats } from 'src/entities/Chats.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetPayload } from 'src/common/decorators/get.payload.decorator';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.dto';
import { UUID } from 'crypto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * 1. 현재 채팅방 조회
   * @param enterUserChatDto
   * @returns
   */
  @Get('/hunsuChat')
  async chatRooms(
    @Query(ChatSplitValidPipe) enterUserChatDto: EnterUserChatDto,
  ): Promise<object> {
    const enterUserChat: object[] = await this.chatService.chatRooms(
      enterUserChatDto,
    );

    return { result: enterUserChat };
  }

  /**
   * 1. 채팅방 생성
   * @param payload
   * @param createUserChatDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('/hunsuChat')
  async createUserChat(
    @GetPayload() payload: JwtPayload,
    @Body(CreateUserChatValidPipe) createUserChatDto: CreateUserChatDto,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;
    const createUserChat: Chats = await this.chatService.createUserChat(
      userIdx,
      createUserChatDto,
    );
    createUserChat;
    return { msg: '채팅방 생성에 성공했습니다.' };
  }

  /**
   * 1. 채팅방 삭제
   * @param payload
   * @param deleteUserChatDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Delete('/hunsuChat/:roomName')
  async deleteUserChat(
    @GetPayload() payload: JwtPayload,
    @Param('roomName') roomName: string,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;
    const chatDelete: void = await this.chatService.deleteUserChat(
      userIdx,
      roomName,
    );
    chatDelete;
    return { msg: '채팅방 삭제에 성공했습니다.' };
  }

  /**
   * 1. 채팅방을 생성한 admin 조회
   * @param roomName
   * @returns
   */
  @Get('/hunsuChat/admin/:roomName')
  async adminUserFind(@Param('roomName') roomName: string): Promise<object> {
    const adminUserFind: object = await this.chatService.adminUserFind(
      roomName,
    );

    return adminUserFind;
  }
}
