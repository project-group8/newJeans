import { Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { CommentLikeService } from './comment-like.service';
import { UUID } from 'crypto';
import { CommentLikeUpdateRequestDto } from './dtos/commentLIke.update.dto';

@Controller('commentLike')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Put('/:postIdx/:commentIdx')
  async postLikes(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @GetPayload() payload: JwtPayload,
  ) {
    const commentLikeUpdateRequestDto = new CommentLikeUpdateRequestDto();

    commentLikeUpdateRequestDto.userIdx = payload.sub;
    commentLikeUpdateRequestDto.postIdx = postIdx;
    commentLikeUpdateRequestDto.commentIdx = commentIdx;

    return await this.commentLikeService.updateCommentLike(
      commentLikeUpdateRequestDto,
    );
  }
}
