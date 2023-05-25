import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  CreateChatSaveDto,
  CreateUserChatDto,
  EnterUserChatDto,
} from './dto/chat.dto';
import { ChatSplitValidPipe } from './pipes/chat.pipe';
import { Chats } from '../entities/Chats.entity';
import { ChatSaves } from '../entities/ChatSaves.entity';

const mockChatController = {
  chatRooms: jest.fn(),
  createUserChat: jest.fn(),
  deleteUserChat: jest.fn(),
  adminUserFind: jest.fn(),
  findChatSave: jest.fn(),
  chatSave: jest.fn(),
  doneChat: jest.fn(),
  liveChat: jest.fn(),
};

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;
  let chatSplitValidPipe: ChatSplitValidPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatSplitValidPipe,
        { provide: ChatService, useValue: mockChatController },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
    chatSplitValidPipe = module.get<ChatSplitValidPipe>(ChatSplitValidPipe);
  });

  it('should be defined', () => {
    expect(chatController).toBeDefined();
  });

  describe('chatRooms', () => {
    it('현재 채팅방 조회', async () => {
      const enterUserChatDto: EnterUserChatDto = {
        splitNumber: 1,
        splitPageNumber: 1,
      };
      const mockData: object[] = [
        {
          chatIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
          roomName: '21321',
          maxParty: 6,
          nickname: '이은형',
        },
      ];

      jest.spyOn(chatService, 'chatRooms').mockResolvedValueOnce(mockData);
      jest
        .spyOn(chatSplitValidPipe, 'transform')
        .mockImplementationOnce((value) => value);
      const testMethod = await chatController.chatRooms(enterUserChatDto);

      expect(testMethod).toEqual({ result: mockData });
      expect(chatService.chatRooms).toHaveBeenCalledWith(enterUserChatDto);
    });
  });

  describe('createUserChat', () => {
    it('createUserChat', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createUserChatDto: CreateUserChatDto = {
        maxParty: 1,
        roomName: 'string',
      };
      const mockDataResult: Chats | Promise<Chats> = new Chats();

      jest
        .spyOn(chatService, 'createUserChat')
        .mockResolvedValue(mockDataResult);
      jest
        .spyOn(chatSplitValidPipe, 'transform')
        .mockImplementation((value) => value);

      const testMethod = await chatController.createUserChat(
        jwtPayload,
        createUserChatDto,
      );

      expect(testMethod).toEqual({ msg: '채팅방 생성에 성공했습니다.' });
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

      const mockDataResult = { msg: '채팅방 삭제에 성공했습니다.' };

      jest.spyOn(chatService, 'deleteUserChat').mockResolvedValue(undefined);

      const testMethod = await chatController.deleteUserChat(
        jwtPayload,
        roomName,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.deleteUserChat).toHaveBeenCalledWith(
        jwtPayload.sub,
        roomName,
      );
    });
  });

  describe('adminUserFind', () => {
    type AdminUser = {
      nickname: string;
    };
    it('adminUserFind', async () => {
      const roomName = 'string';
      const mockData = { nickname: 'test1' };
      const mockDataResult: AdminUser = mockData;

      jest
        .spyOn(chatService, 'adminUserFind')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatController.adminUserFind(roomName);

      expect(testMethod).toEqual({ result: mockDataResult });
      expect(chatService.adminUserFind).toHaveBeenCalledWith(roomName);
    });
  });

  describe('findChatSave', () => {
    it('findChatSave', async () => {
      const chatSaveIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';

      const mockDataResult: ChatSaves = new ChatSaves();

      jest.spyOn(chatService, 'findChatSave').mockResolvedValue(mockDataResult);

      const testMethod = await chatController.findChatSave(chatSaveIdx);

      expect(testMethod).toEqual({ result: mockDataResult });
      expect(chatService.findChatSave).toHaveBeenCalledWith(chatSaveIdx);
    });
  });

  describe('chatSave', () => {
    it('chatSave', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createChatSaveDto: CreateChatSaveDto = {
        nickname: 'string',
        room: 'string',
        saveData: 'string',
      };
      const mockDataResult = { msg: '데이터 저장에 성공했습니다.' };

      jest.spyOn(chatService, 'chatSave').mockResolvedValue(undefined);

      const testMethod = await chatController.chatSave(
        jwtPayload,
        createChatSaveDto,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatService.chatSave).toHaveBeenCalledWith(createChatSaveDto);
    });
  });

  describe('doneChat', () => {
    it('doneChat', async () => {
      const mockData = [
        {
          chatSaveIdx: '05a6c774-5e7f-47a2-81ea-b0da4086d227',
          room: 'dd',
        },
      ];
      const mockDataResult = { doneChats: mockData };

      jest.spyOn(chatService, 'doneChat').mockResolvedValue(mockData);

      const testMethod = await chatController.doneChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('liveChat', () => {
    it('liveChat', async () => {
      const mockDataResult: Chats = new Chats();

      jest.spyOn(chatService, 'liveChat').mockResolvedValue(mockDataResult);

      const testMethod = await chatController.liveChat();

      expect(testMethod).toEqual({ roomName: mockDataResult.roomName });
    });
  });
});
