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
import { CardPostsCategoryTrans } from './pipes/cardposts-category-trans.pipe';
import { SplitCardsDto } from './dto/cardposts.dto';

@Controller('/postCards')
export class CardpostsController {
  constructor(private cardpostsService: CardpostsService) {}

  @Get('/')
  async findSplitCards(
    @Query(CardPostsCategoryTrans) splitCardsDto: SplitCardsDto,
  ) {
    const findSplitCards = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findSplitCards;
  }
}
