import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import {
  CreateChatSaveDto,
  CreateUserChatDto,
  EnterUserChatDto,
} from './dto/chat.dto';
import { UUID } from 'crypto';
import { ChatSaves } from 'src/entities/ChatSaves.entity';
import { Chats } from 'src/entities/Chats.entity';

//수정해야함
const mockChatService = {
  chatRooms: jest.fn(),
  createUserChat: jest.fn(),
  deleteUserChat: jest.fn(),
  adminUserFind: jest.fn(),
  findChatSave: jest.fn(),
  chatSave: jest.fn(),
  doneChat: jest.fn(),
  liveChat: jest.fn(),
};

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('chatRooms', () => {
    it('chatRooms', async () => {
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
        .spyOn(chatService, 'chatRooms')
        .mockReturnValue(Promise.resolve(mockDataResult));

      const testMethod = await chatService.chatRooms(enterUserChatDto);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.chatRooms).toHaveBeenCalledWith(enterUserChatDto);
    });
  });

  describe('createUserChat', () => {
    it('', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createUserChatDto: CreateUserChatDto = {
        maxParty: 1,
        roomName: 'string',
      };
      const mockDataResult = undefined;

      jest
        .spyOn(chatService, 'createUserChat')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatService.createUserChat(
        jwtPayload.sub,
        createUserChatDto,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.createUserChat).toHaveBeenCalledWith(
        jwtPayload.sub,
        createUserChatDto,
      );
    });
  });

  describe('deleteUserChat', () => {
    it('deleteUserChat', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const roomName = 'string';

      const mockDataResult = undefined;

      jest
        .spyOn(chatService, 'deleteUserChat')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatService.deleteUserChat(
        jwtPayload.sub,
        roomName,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.deleteUserChat).toHaveBeenCalledWith(
        jwtPayload.sub,
        roomName,
      );
    });
  });
  type AdminUser = {
    nickname: string;
  };
  describe('adminUserFind', () => {
    it('adminUserFind', async () => {
      const roomName = 'string';
      const mockData: AdminUser = {
        nickname: 'test1',
      };
      const mockDataResult: Promise<AdminUser> = Promise.resolve(mockData);

      jest
        .spyOn(chatService, 'adminUserFind')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatService.adminUserFind(roomName);

      expect(testMethod).toEqual(mockData);
      expect(chatService.adminUserFind).toHaveBeenCalledWith(roomName);
    });
  });

  describe('findChatSave', () => {
    it('findChatSave', async () => {
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

      jest.spyOn(chatService, 'findChatSave').mockResolvedValue(mockDataResult);

      const testMethod = await chatService.findChatSave(chatSaveIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.findChatSave).toHaveBeenCalledWith(chatSaveIdx);
    });
  });

  describe('chatSave', () => {
    it('chatSave', async () => {
      const createChatSaveDto: CreateChatSaveDto = {
        nickname: 'string',
        room: 'string',
        saveData: 'string',
      };
      const mockDataResult = undefined;

      jest.spyOn(chatService, 'chatSave').mockResolvedValue(mockDataResult);

      const testMethod = await chatService.chatSave(createChatSaveDto);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.chatSave).toHaveBeenCalledWith(createChatSaveDto);
    });
  });

  describe('doneChat', () => {
    it('doneChat', async () => {
      const mockData = {
        chatSaveIdx: '05a6c774-5e7f-47a2-81ea-b0da4086d227',
        room: 'dd',
      };
      const mockDataResult = [mockData];

      jest.spyOn(chatService, 'doneChat').mockResolvedValue(mockDataResult);

      const testMethod = await chatService.doneChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('liveChat', () => {
    it('liveChat', async () => {
      const mockDataResult: Chats = {
        chatIdx: '12345678-1234-1234-1234-123456789012',
        userIdx: '12345678-1234-1234-1234-123456789012',
        maxParty: 5,
        roomName: '테스으으테스으으테스으으테스으으테스으으테스으',
        createdAt: new Date(),
        updatedAt: new Date(),
        Users: null, // Chats 엔티티에 Users 속성이 있는 경우
      };

      jest.spyOn(chatService, 'liveChat').mockResolvedValue(mockDataResult);

      const testMethod = await chatService.liveChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });
});
