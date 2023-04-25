import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { CardpostsService } from './cardposts.service';

@Controller('cardposts')
export class CardpostsController {
  constructor(private cardpostsService: CardpostsService) {}

  @Get()
  async findSplitCards() {
    const test = await this.cardpostsService.findOne();
    return test;
  }
}
