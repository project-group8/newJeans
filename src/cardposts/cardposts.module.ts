import { Module } from '@nestjs/common';
import { CardpostsController } from './cardposts.controller';
import { CardpostsService } from './cardposts.service';

@Module({
  controllers: [CardpostsController],
  providers: [CardpostsService],
})
export class CardpostsModule {}
