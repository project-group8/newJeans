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
import {
  ChatSplitValidPipe,
  CreateUserChatValidPipe,
  CreateChatSaveValidPip,
} from './pipes/chat.pipe';
import {
  EnterUserChatDto,
  CreateUserChatDto,
  CreateChatSaveDto,
} from './dto/chat.dto';
import { Chats } from '../entities/Chats.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';
import { UUID } from 'crypto';
import { ChatSaves } from '../entities/ChatSaves.entity';
type AdminUser = {
  nickname: string;
};
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
   * 2. 채팅방 생성
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
   * 3. 채팅방 삭제
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
   * 4. 채팅방을 생성한 admin 조회
   * @param roomName
   * @returns
   */
  @Get('/hunsuChat/admin/:roomName')
  async adminUserFind(@Param('roomName') roomName: string): Promise<object> {
    const adminUserFind: AdminUser = await this.chatService.adminUserFind(
      roomName,
    );

    return { result: adminUserFind };
  }

  /**
   * 5. chatSaveIdx를 이용해 채팅 내역을 가져옵니다.
   * @param chatSaveIdx
   * @returns
   */
  @Get('/chatSave/:chatSaveIdx')
  async findChatSave(@Param('chatSaveIdx') chatSaveIdx: UUID): Promise<object> {
    const findChatSave: ChatSaves = await this.chatService.findChatSave(
      chatSaveIdx,
    );

    return { result: findChatSave };
  }

  /**
   * 6. 채팅 내역을 저장합니다.
   * @param payload
   * @param createChatSaveDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('/chatSave')
  async chatSave(
    @GetPayload() payload: JwtPayload,
    @Body(CreateChatSaveValidPip) createChatSaveDto: CreateChatSaveDto,
  ): Promise<object> {
    const chatSave: void = await this.chatService.chatSave(createChatSaveDto);
    chatSave;
    return { msg: '데이터 저장에 성공했습니다.' };
  }

  /**
   * 7. 삭제된 채팅방의 이름과 chatSaveIdx를 모두 가져옵니다.
   * @returns
   */
  @Get('/doneChat')
  async doneChat(): Promise<object> {
    const doneChat: object[] = await this.chatService.doneChat();
    return { doneChats: doneChat };
  }

  /**
   * 8. 메인에 보여줄 무작위 훈수배틀을 보여줍니다.
   * @returns
   */
  @Get('/hunsuChat/live')
  async liveChat(): Promise<object> {
    const { roomName }: Chats = await this.chatService.liveChat();

    return { roomName: roomName };
  }
}
