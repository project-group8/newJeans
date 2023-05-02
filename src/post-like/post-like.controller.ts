import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { UUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';

@Controller('postlike')
export class PostLikeController {
  constructor(private postLikeService: PostLikeService) {}

  /**
   * 1. post에 좋아요를 토글합니다.
   * @param payload
   * @param postIdx
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Put('/post/:postIdx')
  async postToggleLike(
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;
    const postToggleLike: string = await this.postLikeService.postToggleLike(
      userIdx,
      postIdx,
    );
    return { message: postToggleLike };
  }
}
