import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { UUID } from 'crypto';

@Controller('postlike')
export class PostLikeController {
  constructor(private postLikeService: PostLikeService) {}

  //
  //미완성
  //auth미들웨어 넣어야함
  @Put('/post/:postIdx')
  async postToggleLike(
    @Param('postIdx') postIdx: UUID,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const postToggleLike: string = await this.postLikeService.postToggleLike(
      postIdx,
    );
    return { msg: postToggleLike };
  }
}
