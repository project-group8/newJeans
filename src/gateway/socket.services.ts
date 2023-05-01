import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSaves } from '../entities/ChatSaves.entity';

@Injectable()
export class SocketGatewayService {
  constructor(
    @InjectRepository(ChatSaves)
    private readonly chatSavesRepository: Repository<ChatSaves>,
  ) {}

  async saveChatData(saveData: any, nickname: any, room: any) {
    const chatSave = this.chatSavesRepository.create({
      saveData,
      nickname,
      room,
    });
    await this.chatSavesRepository.save(chatSave);
  }
}
