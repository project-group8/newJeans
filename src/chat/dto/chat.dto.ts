import { PickType } from '@nestjs/mapped-types';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { Chats } from '../../entities/Chats.entity';
import { ChatSaves } from '../../entities/ChatSaves.entity';

export class EnterUserChatDto {
  @IsNumber()
  @Expose()
  splitNumber: number;

  @Expose()
  @IsNumber()
  splitPageNumber: number;
}

export class CreateUserChatDto extends PickType(Chats, [
  'maxParty',
  'roomName',
]) {}

export class CreateChatSaveDto extends PickType(ChatSaves, [
  'nickname',
  'room',
  'saveData',
]) {}
