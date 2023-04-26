import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Req,
} from '@nestjs/common';
import { CardpostsService } from './cardposts.service';
import { CardPostsCategoryTrans } from './pipes/cardposts-category-trans.pipe';
import { SplitCardsDto } from './dto/cardposts.dto';
import { UUID } from 'crypto';

@Controller('/postCards')
export class CardpostsController {
  constructor(private cardpostsService: CardpostsService) {}

  @Get('/')
  async findSplitCards(
    @Query(CardPostsCategoryTrans) splitCardsDto: SplitCardsDto,
  ): Promise<Object[]> {
    const findSplitCards: Object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findSplitCards;
  }

  @Get('/hotPostCard')
  async findHotCards(
    @Query(CardPostsCategoryTrans) splitCardsDto: SplitCardsDto,
  ): Promise<Object[]> {
    const findHotCards: Object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findHotCards;
  }

  @Get('/post/:postIdx') // allusers 미들웨어, count 미들웨어 넣어줘야함
  async findOnePostContents(
    @Param('postIdx') postIdx: UUID,
    @Req() request: string,
  ): Promise<Object> {
    // const { email } = request;
    const findOnePost: Object = await this.cardpostsService.findOnePost(
      postIdx,
    );

    return findOnePost;
  }
}
