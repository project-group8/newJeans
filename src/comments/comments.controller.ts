import { Body, Controller, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetPayload } from 'src/common/decorators/get.payload.decorator';
import { CommentCreateRequestDto } from './dtos/comment.create.request.dto';
import { UUID } from 'crypto';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    @HttpCode(201)
    async createComment(
    @GetPayload() payload: JwtPayload,
    @Body() commentCreateRequestDto: CommentCreateRequestDto,
    @Param('postIdx', new ParseIntPipe()) postIdx: UUID,
  ) {
    commentCreateRequestDto.userIdx = payload.sub;
    commentCreateRequestDto.postIdx = postIdx;

    return await this.commentsService.createComment(commentCreateRequestDto);
  }
}
