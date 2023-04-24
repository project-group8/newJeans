import { Module } from '@nestjs/common';
import { PreferController } from './prefer.controller';
import { PreferService } from './prefer.service';

@Module({
  controllers: [PreferController],
  providers: [PreferService]
})
export class PreferModule {}
