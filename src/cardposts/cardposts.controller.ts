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
  UseGuards,
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
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetPayload } from 'src/common/decorators/get.payload.decorator';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.dto';

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
  // allusers 미들웨어 있어야함 좋아요 여부 확인

  @Get('/post/:postIdx')
  async findOnePost(@Param('postIdx') postIdx: UUID): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const findOnePost: object = await this.cardpostsService.findOnePost(
      postIdx,
    );

    return { post: findOnePost };
  }

  // 미완성
  // allusers 미들웨어 있어야함 어디에 투표했는지 여부 확인
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
  @UseGuards(JwtAuthGuard)
  @Post('/post/createPost')
  async postCard(
    @GetPayload() payload: JwtPayload,
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;

    const postCard: CardPosts = await this.cardpostsService.postCard(
      userIdx,
      createCardDto,
    );

    return { msg: `${postCard.title} 작성에 성공했습니다.` };
  }

  //
  // 미완성 Multer 넣어야함
  @UseGuards(JwtAuthGuard)
  @Put('/post/createPost/:postIdx')
  async updatePost(
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;

    const updatePost: UpdateResult = await this.cardpostsService.updatePost(
      userIdx,
      postIdx,
      createCardDto,
    );

    updatePost;

    return { msg: '게시글 수정에 성공했습니다.' };
  }

  //
  // 미완성
  @UseGuards(JwtAuthGuard)
  @Delete('/post/createPost/:postIdx')
  async deletePost(
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;
    const deletePost: void = await this.cardpostsService.deletePost(
      userIdx,
      postIdx,
    );
    deletePost;
    return { msg: '게시글 삭제에 성공했습니다.' };
  }
}
