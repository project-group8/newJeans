import { Test, TestingModule } from '@nestjs/testing';
import { PreferController } from './prefer.controller';

describe('PreferController', () => {
  let controller: PreferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferController],
    }).compile();

    controller = module.get<PreferController>(PreferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
