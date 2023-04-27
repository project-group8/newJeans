import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments.entity';
import { UsersService } from 'src/users/users.service';

import { CommentCreateRequestDto } from './dtos/comment.create.request.dto';
import { Repository } from 'typeorm/repository/Repository';
import { CommentUpdateRequestDto } from './dtos/comment.update.dto';
import { CommentDeleteRequestDto } from './dtos/comment.delete.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>,
        private readonly usersService: UsersService,
      ) {}

      async createComment(commentCreateRequestDto: CommentCreateRequestDto) {
        const comment = await this.commentsRepository.save({
          ...commentCreateRequestDto,
        });
    
        const user = await this.usersService.findById(
          commentCreateRequestDto.userIdx,
        );
    
    
        return {
          commentIdx: comment.commentIdx,
          userIdx: user.userIdx,
          comment: comment.comment,
          selectedTag: comment.selectedTag,
          nickname: user.nickname,
          createdAt: comment.createdAt,
        };
    }

    async updateComment(commentUpdateRequestDto: CommentUpdateRequestDto) {
        const comment = await this.commentsRepository
          .createQueryBuilder('c')
          .select([
            'c.commentIdx',
            'c.userIdx',
            'c.comment',
            'c.createdAt',
            'c.updatedAt',
            'u.nickname',
          ])
          .leftJoin('c.Users', 'u')
          .where('c.commentIdx = :commentIdx', { commentIdx: commentUpdateRequestDto.commentIdx })
          .andWhere('u.userIdx = :userIdx', { userIdx: commentUpdateRequestDto.userIdx })
          .getOne();
    
        if (!comment)
          throw new UnauthorizedException(
            '존재하지 않는 댓글이거나 권한이 없습니다.',
          );
    
        await this.commentsRepository.update(commentUpdateRequestDto.commentIdx, {
          comment: commentUpdateRequestDto.comment,
        });
    
        return {
          commentIdx: comment.commentIdx,
          comment: commentUpdateRequestDto.comment,
          nickname: comment.Users.nickname,
          userIdx: comment.userIdx,
          createdAt: comment.createdAt,
        };
    }

    async deleteComment(commentDeleteRequestDto: CommentDeleteRequestDto) {
        const comment = await this.commentsRepository
          .createQueryBuilder('c')
          .select(['c.commentIdx', 'u.userIdx'])
          .leftJoin('c.Users', 'u')
          .where('c.commentIdx = :commentIdx', { commentIdx: commentDeleteRequestDto.commentIdx })
          .andWhere('u.userIdx = :userIdx', { userIdx: commentDeleteRequestDto.userIdx })
          .getOne();
    
        if (!comment)
          throw new UnauthorizedException(
            '존재하지 않는 댓글이거나 권한이 없습니다.',
          );
        await this.commentsRepository.delete(comment);
    
        return '댓글 삭제가 완료되었습니다.';
      }


}
