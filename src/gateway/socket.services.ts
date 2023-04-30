import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSaves } from 'src/entities/ChatSaves.entity';

@Injectable()
export class SocketGatewayService {
  constructor(
    @InjectRepository(ChatSaves)
    private readonly chatSavesRepository: Repository<ChatSaves>,
  ) {}

  async saveChatData(saveData: string, nickname: string, room: string) {
    const chatSave = this.chatSavesRepository.create({
      saveData,
      nickname,
      room,
    });
    await this.chatSavesRepository.save(chatSave);
  }
}
