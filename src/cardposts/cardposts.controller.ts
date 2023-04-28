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
import { AllUsersJwtAuthGuard } from 'src/middleware/allusersjwtauthguard';

@Controller('/postCards')
export class CardpostsController {
  constructor(private cardpostsService: CardpostsService) {}

  /**
   * 1. 페이지 네이션 기능.
   * @param splitCardsDto
   * @returns
   */
  @Get('/')
  async findSplitCards(
    @Query(CardPostsCategoryTransPipe) splitCardsDto: SplitCardsDto,
  ): Promise<object[]> {
    const findSplitCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findSplitCards;
  }

  /**
   * 1. 인기게시글 조회 기능.
   * @param splitCardsDto
   * @returns
   */
  @Get('/hotPostCard')
  async findHotCards(
    @Query(HotCardPostsMockPipe) splitCardsDto: SplitCardsDto,
  ): Promise<object[]> {
    const findHotCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return findHotCards;
  }

  /**
   * 1. 상세페이지 조회
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(AllUsersJwtAuthGuard)
  @Get('/post/:postIdx')
  async findOnePost(
    @GetPayload() payload: JwtPayload | null,
    @Param('postIdx') postIdx: UUID,
  ): Promise<object> {
    const userIdx: UUID = payload ? payload.sub : null;
    const findOnePost: object = await this.cardpostsService.findOnePost(
      userIdx,
      postIdx,
    );

    return { post: findOnePost };
  }

  /**
   * 1. 상세페이지 Contents 조회
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(AllUsersJwtAuthGuard)
  @Get('/post/contents/:postIdx')
  async findOnePostContents(
    @GetPayload() payload: JwtPayload | null,
    @Param('postIdx') postIdx: UUID,
  ): Promise<object> {
    const userIdx: UUID = payload ? payload.sub : null;
    const findOnePostContents: object =
      await this.cardpostsService.findOnePostContents(userIdx, postIdx);

    return { contents: findOnePostContents };
  }

  /**
   * 1. 상세페이지 Category 조회
   * @param postIdx
   * @returns
   */
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

  /**
   * 1. 게시글 삭제
   * @param payload
   * @param postIdx
   * @returns
   */
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
