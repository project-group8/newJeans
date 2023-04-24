import { Test, TestingModule } from '@nestjs/testing';
import { ReplycommentsService } from './replycomments.service';

describe('ReplycommentsService', () => {
  let service: ReplycommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplycommentsService],
    }).compile();

    service = module.get<ReplycommentsService>(ReplycommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
