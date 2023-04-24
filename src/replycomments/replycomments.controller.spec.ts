import { Test, TestingModule } from '@nestjs/testing';
import { ReplycommentsController } from './replycomments.controller';

describe('ReplycommentsController', () => {
  let controller: ReplycommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplycommentsController],
    }).compile();

    controller = module.get<ReplycommentsController>(ReplycommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
