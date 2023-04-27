import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetPayload } from 'src/common/decorators/get.payload.decorator';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.dto';

@Controller('postlike')
export class PostLikeController {
  constructor(private postLikeService: PostLikeService) {}

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
    return { msg: postToggleLike };
  }
}
