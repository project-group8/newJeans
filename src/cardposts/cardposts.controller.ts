import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Req,
  Body,
} from '@nestjs/common';
import { CardpostsService } from './cardposts.service';
import { CardPosts } from '../entities/CardPosts.entity';
import {
  CardPostsCategoryTransPipe,
  HotCardPostsMockPipe,
  CardPostCreateValidPipe,
} from './pipes/cardposts-category-trans.pipe';
import { SplitCardsDto, CreateCardDto } from './dto/cardposts.dto';
import { UUID } from 'crypto';
import { UpdateResult } from 'typeorm';

@Controller('/postCards')
export class CardpostsController {
  constructor(private cardpostsService: CardpostsService) {}

  @Get('/')
  async findSplitCards(
    @Query(CardPostsCategoryTransPipe) splitCardsDto: SplitCardsDto,
  ): Promise<object[]> {
    const findSplitCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findSplitCards;
  }

  @Get('/hotPostCard')
  async findHotCards(
    @Query(HotCardPostsMockPipe) splitCardsDto: SplitCardsDto,
  ): Promise<object[]> {
    const findHotCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findHotCards;
  }

  // 미완성
  @Get('/post/:postIdx') // allusers 미들웨어, count 미들웨어 넣어줘야함
  async findOnePost(
    @Param('postIdx') postIdx: UUID,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const findOnePost: object = await this.cardpostsService.findOnePost(
      postIdx,
    );

    return { post: findOnePost };
  }

  // 미완성
  @Get('/post/contents/:postIdx')
  async findOnePostContents(
    @Param('postIdx') postIdx: UUID,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const findOnePostContents: object =
      await this.cardpostsService.findOnePostContents(postIdx);

    return { contents: findOnePostContents };
  }

  @Get('/post/category/:postIdx')
  async findOnePostCategorys(@Param('postIdx') postIdx: UUID): Promise<object> {
    const findOnePostCategorys: object =
      await this.cardpostsService.findOnePostCategorys(postIdx);
    return findOnePostCategorys;
  }

  //
  // 미완성 Multer 넣어야함
  @Post('/post/createPost') // authmiddleware 달아줘야함
  async postCard(
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const postCard: CardPosts = await this.cardpostsService.postCard(
      createCardDto,
    );

    return { msg: `${postCard.title} 작성에 성공했습니다.` };
  }

  @Put('/post/createPost/:postIdx')
  async updatePost(
    @Param('postIdx') postIdx: UUID,
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const updatePost: UpdateResult = await this.cardpostsService.updatePost(
      postIdx,
      createCardDto,
    );

    updatePost;

    return { msg: '게시글 수정에 성공했습니다.' };
  }
}
