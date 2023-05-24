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
import { UUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { ReplyCommentCreateRequestDto } from './dtos/replycomments.create.request.dto';
import { ReplycommentsService } from './replycomments.service';
import { ReplyCommentUpdateRequestDto } from './dtos/replycomments.update.dto';
import { ReplyCommentDeleteRequestDto } from './dtos/replycomments.delete.dto';
import { AllUsersJwtAuthGuard } from '../middleware/allusersjwtauthguard';
import { ReplyCommentGetRequestDto } from './dtos/replycommnets.get.dto';

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

    return await this.replycommentsService.createReplyComment(
      replycommentCreateRequestDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Put(':postIdx/:commentIdx/:replyIdx')
  async updateReplyComment(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @Param('replyIdx') replyIdx: UUID,
    @GetPayload() payload: JwtPayload,
    @Body() replycommentUpdateRequestDto: ReplyCommentUpdateRequestDto,
  ) {
    replycommentUpdateRequestDto.userIdx = payload.sub;
    replycommentUpdateRequestDto.postIdx = postIdx;
    replycommentUpdateRequestDto.commentIdx = commentIdx;
    replycommentUpdateRequestDto.replyIdx = replyIdx;

    return await this.replycommentsService.updateReplyComment(
      replycommentUpdateRequestDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postIdx/:commentIdx/:replyIdx')
  @HttpCode(204)
  async deleteReplyComment(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @Param('replyIdx') replyIdx: UUID,
    @GetPayload() payload: JwtPayload,
  ) {
    const replycommentDeleteRequestDto = new ReplyCommentDeleteRequestDto();

    replycommentDeleteRequestDto.userIdx = payload.sub;
    replycommentDeleteRequestDto.postIdx = postIdx;
    replycommentDeleteRequestDto.replyIdx = replyIdx;
    replycommentDeleteRequestDto.commentIdx = commentIdx;

    return await this.replycommentsService.deleteReplyComment(
      replycommentDeleteRequestDto,
    );
  }

  @UseGuards(AllUsersJwtAuthGuard)
  @Get(':postIdx/:commentIdx/')
  @HttpCode(200)
  async getAllReplyComment(
    @Param('postIdx') postIdx: UUID,
    @Param('commentIdx') commentIdx: UUID,
    @GetPayload() payload: JwtPayload,
  ) {
    const replycommentGetRequestDto = new ReplyCommentGetRequestDto();

    replycommentGetRequestDto.userIdx = payload ? payload.sub : null;
    replycommentGetRequestDto.postIdx = postIdx;
    replycommentGetRequestDto.commentIdx = commentIdx;
    const response = {
      replys: await this.replycommentsService.getAllReplyComment(
        replycommentGetRequestDto,
      ),
    };

    return response;
  }
}
