import { Test, TestingModule } from '@nestjs/testing';
import { PreferService } from './prefer.service';

describe('PreferService', () => {
  let service: PreferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferService],
    }).compile();

    service = module.get<PreferService>(PreferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
