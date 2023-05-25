import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyComments } from '../entities/ReplyComments.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm/repository/Repository';
import { ReplyCommentCreateRequestDto } from './dtos/replycomments.create.request.dto';
import { ReplyCommentUpdateRequestDto } from './dtos/replycomments.update.dto';
import { ReplyCommentDeleteRequestDto } from './dtos/replycomments.delete.dto';
import { ReplyCommentGetRequestDto } from './dtos/replycommnets.get.dto';

@Injectable()
export class ReplycommentsService {
  constructor(
    @InjectRepository(ReplyComments)
    private readonly replycommentsRepository: Repository<ReplyComments>,
    private readonly usersService: UsersService,
  ) {}

  async createReplyComment(
    replycommentCreateRequestDto: ReplyCommentCreateRequestDto,
  ) {
    const replycomment = await this.replycommentsRepository.save({
      ...replycommentCreateRequestDto,
    });

    const user = await this.usersService.findById(
      replycommentCreateRequestDto.userIdx,
    );

    return {
      replyIdx: replycomment.replyIdx,
      commentIdx: replycommentCreateRequestDto.commentIdx,
      postIdx: replycommentCreateRequestDto.postIdx,
      nickname: user.nickname,
      comment: replycomment.comment,
      createdAt: replycomment.createdAt,
    };
  }

  async updateReplyComment(
    replycommentUpdateRequestDto: ReplyCommentUpdateRequestDto,
  ) {
    const replycomment = await this.replycommentsRepository
      .createQueryBuilder('r')
      .select([
        'r.replyIdx',
        'r.userIdx',
        'r.comment',
        'r.createdAt',
        'r.updatedAt',
        'u.nickname',
      ])
      .leftJoin('r.Users', 'u')
      .where('r.replyIdx = :replyIdx', {
        replyIdx: replycommentUpdateRequestDto.replyIdx,
      })
      .andWhere('u.userIdx = :userIdx', {
        userIdx: replycommentUpdateRequestDto.userIdx,
      })
      .getOne();

    if (!replycomment)
      throw new UnauthorizedException(
        '존재하지 않는 답글이거나 권한이 없습니다.',
      );

    await this.replycommentsRepository.update(
      replycommentUpdateRequestDto.commentIdx,
      {
        comment: replycommentUpdateRequestDto.comment,
      },
    );

    return {
      comment: replycommentUpdateRequestDto.comment,
    };
  }

  async deleteReplyComment(
    replycommentDeleteRequestDto: ReplyCommentDeleteRequestDto,
  ) {
    const replycomment = await this.replycommentsRepository
      .createQueryBuilder('r')
      .select(['r.replyIdx', 'u.userIdx'])
      .leftJoin('r.Users', 'u')
      .where('r.replyIdx = :replyIdx', {
        replyIdx: replycommentDeleteRequestDto.replyIdx,
      })
      .andWhere('u.userIdx = :userIdx', {
        userIdx: replycommentDeleteRequestDto.userIdx,
      })
      .getOne();

    if (!replycomment)
      throw new UnauthorizedException(
        '존재하지 않는 답글이거나 권한이 없습니다.',
      );
    await this.replycommentsRepository.delete(replycomment);

    return '답글을 삭제했습니다.';
  }

  async getAllReplyComment(
    replycommentGetRequestDto: ReplyCommentGetRequestDto,
  ) {
    const allReplyComment = await this.replycommentsRepository
      .createQueryBuilder('r')
      .select([
        'r.replyIdx',
        'r.commentIdx',
        'r.postIdx',
        'u.nickname',
        'r.comment',
        'r.createdAt',
      ])
      .leftJoin('r.Users', 'u')
      .where('r.commentIdx = :commentIdx', {
        commentIdx: replycommentGetRequestDto.commentIdx,
      })
      // .andWhere('u.userIdx = :userIdx', { userIdx: commentGetRequestDto.userIdx })
      .orderBy('r.createdAt', 'DESC')
      .getMany();

    if (!allReplyComment) {
      throw new BadRequestException('답글 조회에 실패했습니다.');
    }

    const data = allReplyComment.map((replyComment) => {
      return {
        replyIdx: replyComment.replyIdx,
        commentIdx: replyComment.commentIdx,
        postIdx: replyComment.postIdx,
        nickname: replyComment.Users.nickname,
        comment: replyComment.comment,
        createdAt: replyComment.createdAt,
      };
    });

    return data;
  }
}
