import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'src/entities/Chats.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import {
  EnterUserChatDto,
  CreateUserChatDto,
  DeleteUserChatDto,
} from './dto/chat.dto';
import { Users } from 'src/entities/Users.entity';
import { UUID } from 'crypto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private chatRepository: Repository<Chats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async chatRooms(enterUserChatDto: EnterUserChatDto): Promise<object[]> {
    const { splitNumber, splitPageNumber } = enterUserChatDto;

    const qb: SelectQueryBuilder<object> = await this.chatRepository
      .createQueryBuilder('c')
      .orderBy('c.createdAt', 'DESC')
      .offset(splitNumber * (splitPageNumber - 1))
      .limit(splitNumber)
      .leftJoin(Users, 'u', 'c.userIdx = u.userIdx')
      .select(['c.chatIdx', 'c.roomName', 'c.maxParty', 'u.nickname']);

    return qb.getRawMany();
  }

  async createUserChat(
    userIdx: UUID,
    createUserChatDto: CreateUserChatDto,
  ): Promise<Chats> {
    const { maxParty, roomName } = createUserChatDto;

    const createChat: Chats = await this.chatRepository.create({
      userIdx,
      maxParty,
      roomName,
    });

    return createChat;
  }

  async deleteUserChat(
    userIdx: UUID,
    deleteUserChatDto: DeleteUserChatDto,
  ): Promise<void> {
    const { roomName } = deleteUserChatDto;

    const exesitChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!exesitChat) {
      throw new BadRequestException('해당 채팅이 존재하지 않습니다.');
    }

    const deleteChat: DeleteResult = await this.chatRepository
      .createQueryBuilder('c')
      .delete()
      .from(Chats)
      .where('c.roomName = :roomName, c.userIdx = :userIdx', {
        roomName,
        userIdx,
      })
      .execute();

    deleteChat;
    return;
  }

  async adminUserFind(roomName: string): Promise<Chats> {
    const existChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!existChat) {
      throw new BadRequestException(
        `${roomName} 해당 채팅방이 존재하지 않습니다.`,
      );
    }

    const findAdmin: Chats = await this.chatRepository
      .createQueryBuilder('c')
      .where('c.roomName = :roomName', { roomName })
      .select(['u.nickname as nickname'])
      .leftJoin(Users, 'u', 'c.userIdx = u.userIdx')
      .getRawOne();

    return findAdmin;
  }
}
