import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';
import { CommentCreateRequestDto } from './dtos/comment.create.request.dto';
import { UUID } from 'crypto';
import { CommentUpdateRequestDto } from './dtos/comment.update.dto';
import { CommentDeleteRequestDto } from './dtos/comment.delete.dto';
import { CommentGetRequestDto } from './dtos/comment.get.dto';
import { AllUsersJwtAuthGuard } from '../middleware/allusersjwtauthguard';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postIdx')
  @HttpCode(201)
  async createComment(
    @GetPayload() payload: JwtPayload,
    @Body() commentCreateRequestDto: CommentCreateRequestDto,
    @Param('postIdx') postIdx: UUID,
  ) {
    commentCreateRequestDto.userIdx = payload.sub;
    commentCreateRequestDto.postIdx = postIdx;

    return await this.commentsService.createComment(commentCreateRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Put(':postIdx/:commentIdx')
  async updateComment(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @GetPayload() payload: JwtPayload,
    @Body() commentUpdateRequestDto: CommentUpdateRequestDto,
  ) {
    commentUpdateRequestDto.userIdx = payload.sub;
    commentUpdateRequestDto.postIdx = postIdx;
    commentUpdateRequestDto.commentIdx = commentIdx;

    return await this.commentsService.updateComment(commentUpdateRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postIdx/:commentIdx')
  @HttpCode(204)
  async deleteComment(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @GetPayload() payload: JwtPayload,
  ) {
    const commentDeleteRequestDto = new CommentDeleteRequestDto();

    commentDeleteRequestDto.userIdx = payload.sub;
    commentDeleteRequestDto.postIdx = postIdx;
    commentDeleteRequestDto.commentIdx = commentIdx;

    return await this.commentsService.deleteComment(commentDeleteRequestDto);
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(AllUsersJwtAuthGuard)
  @Get(':postIdx')
  @HttpCode(200)
  async getAllComment(
    @Param('postIdx') postIdx: UUID,
    @GetPayload() payload: JwtPayload,
  ) {
    const commentGetRequestDto = new CommentGetRequestDto();

    commentGetRequestDto.userIdx = payload ? payload.sub : null;
    commentGetRequestDto.postIdx = postIdx;

    // return await this.commentsService.getAllComment(commentGetRequestDto);

    const response = {
      comments: await this.commentsService.getAllComment(commentGetRequestDto),
    };

    return response;
  }
}
