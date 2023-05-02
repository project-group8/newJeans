import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  CreateChatSaveDto,
  CreateUserChatDto,
  EnterUserChatDto,
} from './dto/chat.dto';
import { ChatSplitValidPipe } from './pipes/chat.pipe';

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
      const mockData = {
        chatIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        roomName: '21321',
        maxParty: 6,
        nickname: '이은형',
      };
      const mockDataResult = { result: { mockData } };

      jest
        .spyOn(chatController, 'chatRooms')
        .mockResolvedValueOnce(mockDataResult);
      jest
        .spyOn(chatSplitValidPipe, 'transform')
        .mockImplementationOnce((value) => value);
      const testMethod = await chatController.chatRooms(enterUserChatDto);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.chatRooms).toHaveBeenCalledWith(enterUserChatDto);
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
      const mockDataResult = { msg: '채팅방 생성에 성공했습니다.' };

      jest
        .spyOn(chatController, 'createUserChat')
        .mockResolvedValue(mockDataResult);
      jest
        .spyOn(chatSplitValidPipe, 'transform')
        .mockImplementation((value) => value);

      const testMethod = await chatController.createUserChat(
        jwtPayload,
        createUserChatDto,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.createUserChat).toHaveBeenCalledWith(
        jwtPayload,
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

      jest
        .spyOn(chatController, 'deleteUserChat')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatController.deleteUserChat(
        jwtPayload,
        roomName,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.deleteUserChat).toHaveBeenCalledWith(
        jwtPayload,
        roomName,
      );
    });
  });

  describe('adminUserFind', () => {
    it('adminUserFind', async () => {
      const roomName = 'string';
      const mockData = { nickname: 'test1' };
      const mockDataResult = { result: mockData };

      jest
        .spyOn(chatController, 'adminUserFind')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatController.adminUserFind(roomName);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.adminUserFind).toHaveBeenCalledWith(roomName);
    });
  });

  describe('findChatSave', () => {
    it('findChatSave', async () => {
      const chatSaveIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockData = {
        saveData: 'sting',
      };
      const mockDataResult = { result: mockData };

      jest
        .spyOn(chatController, 'findChatSave')
        .mockResolvedValue(mockDataResult);

      const testMethod = await chatController.findChatSave(chatSaveIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.findChatSave).toHaveBeenCalledWith(chatSaveIdx);
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

      jest.spyOn(chatController, 'chatSave').mockResolvedValue(mockDataResult);

      const testMethod = await chatController.chatSave(
        jwtPayload,
        createChatSaveDto,
      );

      expect(testMethod).toEqual(mockDataResult);
      expect(chatController.chatSave).toHaveBeenCalledWith(
        jwtPayload,
        createChatSaveDto,
      );
    });
  });

  describe('doneChat', () => {
    it('doneChat', async () => {
      const mockData = {
        chatSaveIdx: '05a6c774-5e7f-47a2-81ea-b0da4086d227',
        room: 'dd',
      };
      const mockDataResult = { doneChats: mockData };

      jest.spyOn(chatController, 'doneChat').mockResolvedValue(mockDataResult);

      const testMethod = await chatController.doneChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('liveChat', () => {
    it('liveChat', async () => {
      const mockDataResult = {
        roomName: '테스으으테스으으테스으으테스으으테스으으테스으',
      };

      jest.spyOn(chatController, 'liveChat').mockResolvedValue(mockDataResult);

      const testMethod = await chatController.liveChat();

      expect(testMethod).toEqual(mockDataResult);
    });
  });
});
