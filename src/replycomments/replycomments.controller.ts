import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.dto';
import { GetPayload } from 'src/common/decorators/get.payload.decorator';
import { ReplyCommentCreateRequestDto } from './dtos/replycomments.create.request.dto';
import { ReplycommentsService } from './replycomments.service';

@Controller('reply')
export class ReplycommentsController {
    constructor(private readonly replycommentsService: ReplycommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':postIdx/:commentIdx')
    @HttpCode(201)
    async createReplyComment(
      @GetPayload() payload: JwtPayload,
      @Body() replycommentCreateRequestDto: ReplyCommentCreateRequestDto,
      @Param('postIdx') postIdx: UUID,
      @Param('commentIdx') commentIdx: UUID,
    ) {
        replycommentCreateRequestDto.userIdx = payload.sub;
        replycommentCreateRequestDto.postIdx = postIdx;
        replycommentCreateRequestDto.commentIdx = commentIdx;

      return await this.replycommentsService.createReplyComment(replycommentCreateRequestDto);
    }

}
