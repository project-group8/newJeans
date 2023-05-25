import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import {
  CreateChatSaveDto,
  CreateUserChatDto,
  EnterUserChatDto,
} from './dto/chat.dto';
import { UUID } from 'crypto';
import { ChatSaves } from '../entities/ChatSaves.entity';
import { Chats } from '../entities/Chats.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

const mockChatEntitiy = () => ({
  chatRooms: jest.fn(),
  createUserChat: jest.fn(),
  deleteUserChat: jest.fn(),
  adminUserFind: jest.fn(),
  findChatSave: jest.fn(),
  chatSave: jest.fn(),
  doneChat: jest.fn(),
  liveChat: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    orderBy: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(undefined),
  })),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('ChatService', () => {
  let chatService: ChatService;
  let chatRepository: MockRepository<Chats>;
  let chatSavesRepository: MockRepository<ChatSaves>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getRepositoryToken(Chats), useValue: mockChatEntitiy() },
        { provide: getRepositoryToken(ChatSaves), useValue: mockChatEntitiy() },
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    chatRepository = module.get<MockRepository<Chats>>(
      getRepositoryToken(Chats),
    );
    chatSavesRepository = module.get<MockRepository<ChatSaves>>(
      getRepositoryToken(ChatSaves),
    );
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('chatRooms', () => {
    it('채팅방을 조회합니다. 페이지네이션으로 작동합니다.', async () => {
      const enterUserChatDto: EnterUserChatDto = {
        splitNumber: 1,
        splitPageNumber: 1,
      };

      const mockData = {
        chatIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        roomName: '21321',
        maxParty: 6,
        nickname: '이은형',
      };
      const mockDataResult = [mockData];

      jest
        .spyOn(chatRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            orderBy: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await chatService.chatRooms(enterUserChatDto);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('createUserChat', () => {
    it('채팅방을 생성 합니다.', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createUserChatDto: CreateUserChatDto = {
        maxParty: 1,
        roomName: 'string',
      };
      const mockDataResult = undefined;

      jest.spyOn(chatRepository, 'save').mockResolvedValue(undefined);

      const testMethod = await chatService.createUserChat(
        jwtPayload.sub,
        createUserChatDto,
      );

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('deleteUserChat', () => {
    it('해당 채팅이 존재하지 않을때', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const roomName = 'string';

      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(null);

      await expect(
        chatService.deleteUserChat(jwtPayload.sub, roomName),
      ).rejects.toThrow(BadRequestException);
    });

    it('해당 게시글 삭제 권한이 없습니다.', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const ortherjwtPayload = {
        sub: 'ad05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const roomName = 'string';

      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(ortherjwtPayload);

      await expect(
        chatService.deleteUserChat(jwtPayload.sub, roomName),
      ).rejects.toThrow(BadRequestException);
    });

    it('채팅방을 삭제합니다.', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const roomName = 'string';

      const mockDataResult = undefined;
      const mockChat = {
        userIdx: jwtPayload.sub,
        roomName: roomName,
      };

      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChat);
      jest
        .spyOn(chatRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await chatService.deleteUserChat(
        jwtPayload.sub,
        roomName,
      );

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  type AdminUser = {
    nickname: string;
  };
  describe('adminUserFind', () => {
    it('해당 채팅방이 존재하지 않음', async () => {
      const roomName = 'string';
      const mockData: AdminUser = {
        nickname: 'test1',
      };
      const mockDataResult = mockData;

      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(null);

      await expect(chatService.adminUserFind(roomName)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('채팅방을 생성한 admin 조회', async () => {
      const roomName = 'string';
      const mockData: AdminUser = {
        nickname: 'test1',
      };
      const mockDataResult = mockData;

      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(roomName);
      jest
        .spyOn(chatRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await chatService.adminUserFind(roomName);

      expect(testMethod).toEqual(mockData);
    });
  });

  describe('findChatSave', () => {
    it('채팅 내역을 가져옵니다', async () => {
      const chatSaveIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockData: ChatSaves = {
        chatSaveIdx: chatSaveIdx,
        nickname: 'string',
        room: 'string',
        saveData: 'string',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockDataResult = mockData;

      jest
        .spyOn(chatSavesRepository, 'findOne')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatService.findChatSave(chatSaveIdx);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('chatSave', () => {
    it('채팅 내역을 저장합니다.', async () => {
      const createChatSaveDto: CreateChatSaveDto = {
        nickname: 'string',
        room: 'string',
        saveData: 'string',
      };
      const mockDataResult = undefined;

      jest.spyOn(chatSavesRepository, 'save').mockResolvedValue(undefined);

      const testMethod = await chatService.chatSave(createChatSaveDto);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('채팅 내역 저장에 실패하면 에러를 발생시킵니다.', async () => {
      const createChatSaveDto: CreateChatSaveDto = {
        nickname: 'string',
        room: 'string',
        saveData: 'string',
      };

      jest.spyOn(chatSavesRepository, 'save').mockImplementation(() => {
        throw new Error();
      });

      try {
        await chatService.chatSave(createChatSaveDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('채팅 저장에 실패했습니다.');
      }
    });
  });

  describe('doneChat', () => {
    it('삭제된 채팅방의 이름과 chatSaveIdx를 모두 가져옵니다.', async () => {
      const mockData = {
        chatSaveIdx: '05a6c774-5e7f-47a2-81ea-b0da4086d227',
        room: 'dd',
      };
      const mockDataResult = [mockData];

      jest
        .spyOn(chatSavesRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await chatService.doneChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('liveChat', () => {
    it('메인에 보여줄 무작위 훈수배틀을 보여줍니다.', async () => {
      const mockDataResult: Chats = {
        chatIdx: '12345678-1234-1234-1234-123456789012',
        userIdx: '12345678-1234-1234-1234-123456789012',
        maxParty: 5,
        roomName: '테스으으테스으으테스으으테스으으테스으으테스으',
        createdAt: new Date(),
        updatedAt: new Date(),
        Users: null, // Chats 엔티티에 Users 속성이 있는 경우
      };

      jest
        .spyOn(chatRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });
      const testMethod = await chatService.liveChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });
});
