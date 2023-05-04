import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CardpostsService } from './cardposts.service';
import { CardPosts } from '../entities/CardPosts.entity';
import {
  CardPostsCategoryTransPipe,
  HotCardPostsMockPipe,
  CardPostCreateValidPipe,
} from './pipes/cardposts-category-trans.pipe';
import {
  SplitCardsDto,
  CreateCardDto,
  CardPostWithIsLike,
  CardPostWithContents,
} from './dto/cardposts.dto';
import { UUID } from 'crypto';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';
import { AllUsersJwtAuthGuard } from '../middleware/allusersjwtauthguard';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  ): Promise<{ postCards: object[] }> {
    const postCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return { postCards: postCards };
  }

  /**
   * 2. 인기게시글 조회 기능.
   * @param splitCardsDto
   * @returns
   */
  @Get('/hotPostCard')
  async findHotCards(
    @Query(HotCardPostsMockPipe) splitCardsDto: SplitCardsDto,
  ): Promise<{ postCards: object[] }> {
    const postCards: object[] = await this.cardpostsService.findSplitCards(
      splitCardsDto,
    );
    return { postCards: postCards };
  }

  /**
   * 3. 상세페이지 조회
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(AllUsersJwtAuthGuard)
  @Get('/post/:postIdx')
  async findOnePost(
    @GetPayload() payload: JwtPayload | null,
    @Param('postIdx') postIdx: UUID,
  ): Promise<{ post: CardPostWithIsLike }> {
    const userIdx: UUID = payload ? payload.sub : null;
    const post: CardPostWithIsLike = await this.cardpostsService.findOnePost(
      userIdx,
      postIdx,
    );

    return { post: post };
  }

  /**
   * 4. 상세페이지 Contents 조회
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(AllUsersJwtAuthGuard)
  @Get('/post/contents/:postIdx')
  async findOnePostContents(
    @GetPayload() payload: JwtPayload | null,
    @Param('postIdx') postIdx: UUID,
  ): Promise<{ contents: CardPostWithContents }> {
    const userIdx: UUID = payload ? payload.sub : null;
    const contents: CardPostWithContents =
      await this.cardpostsService.findOnePostContents(userIdx, postIdx);

    return { contents: contents };
  }

  /**
   * 5. 상세페이지 Category 조회
   * @param postIdx
   * @returns
   */
  @Get('/post/category/:postIdx')
  async findOnePostCategorys(@Param('postIdx') postIdx: UUID): Promise<object> {
    const data: object = await this.cardpostsService.findOnePostCategorys(
      postIdx,
    );
    return data;
  }

  /**
   * 6. 게시글 작성하기
   * @param payload
   * @param createCardDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 4))
  @Post('/post/createPost')
  async postCard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetPayload() payload: JwtPayload,
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
  ): Promise<{ msg: string }> {
    const userIdx: UUID = payload.sub;
    const postCard: CardPosts = await this.cardpostsService.postCard(
      userIdx,
      createCardDto,
      files,
    );
    postCard;
    return { msg: '포스트 작성에 성공했습니다.' };
  }

  /**
   * 7. 게시글 수정하기
   * @param payload
   * @param postIdx
   * @param createCardDto
   * @param files
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 4))
  @Put('/post/createPost/:postIdx')
  async updatePost(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
    @Body(CardPostCreateValidPipe) createCardDto: CreateCardDto,
  ): Promise<{ msg: string }> {
    const userIdx: UUID = payload.sub;

    const updatePost: UpdateResult = await this.cardpostsService.updatePost(
      userIdx,
      postIdx,
      createCardDto,
      files,
    );

    updatePost;

    return { msg: '게시글 수정에 성공했습니다.' };
  }

  /**
   * 8. 게시글 삭제
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Delete('/post/createPost/:postIdx')
  async deletePost(
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
  ): Promise<{ msg: string }> {
    const userIdx: UUID = payload.sub;
    const deletePost: void = await this.cardpostsService.deletePost(
      userIdx,
      postIdx,
    );
    deletePost;
    return { msg: '게시글 삭제에 성공했습니다.' };
  }

  /**
   * 9. 지정 카드의 Img 배열을 가져옵니다.
   * @param postIdx
   * @returns
   */
  @Get('/post/imgs/:postIdx')
  async findImg(@Param('postIdx') postIdx: UUID): Promise<{ imgs: string[] }> {
    const findImg: string[] = await this.cardpostsService.findImg(postIdx);

    return { imgs: findImg };
  }
}
