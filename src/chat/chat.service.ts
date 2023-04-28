import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'src/entities/Chats.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { EnterUserChatDto, CreateUserChatDto } from './dto/chat.dto';
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

  /**
   * 1. 채팅방을 조회합니다 페이지 네이션으로 작동합니다.
   * @param enterUserChatDto
   * @returns
   */
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

  /**
   * 1. 채팅방 생성
   * @param userIdx
   * @param createUserChatDto
   * @returns
   */
  async createUserChat(
    userIdx: UUID,
    createUserChatDto: CreateUserChatDto,
  ): Promise<Chats> {
    const { maxParty, roomName } = createUserChatDto;

    const createChat: Chats = await this.chatRepository.save({
      userIdx,
      maxParty,
      roomName,
    });

    return createChat;
  }

  /**
   * 1. 채팅방 삭제
   * @param userIdx
   * @param deleteUserChatDto
   * @returns
   */
  async deleteUserChat(userIdx: UUID, roomName: string): Promise<void> {
    const exesitChat: Chats = await this.chatRepository.findOne({
      where: { roomName },
    });

    if (!exesitChat) {
      throw new BadRequestException('해당 채팅이 존재하지 않습니다.');
    }
    if (exesitChat.userIdx !== userIdx) {
      throw new BadRequestException('해당 게시글 삭제 권한이 없습니다.');
    }

    await this.chatRepository
      .createQueryBuilder()
      .delete()
      .from(Chats)
      .where('roomName = :roomName AND userIdx = :userIdx', {
        roomName,
        userIdx,
      })
      .execute();

    return;
  }

  /**
   * 1. 채팅방을 생성한 admin 조회
   * @param roomName
   * @returns
   */
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
