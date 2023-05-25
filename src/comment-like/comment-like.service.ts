import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLikes } from '../entities/CommentLikes.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm/repository/Repository';
import { CommentLikeUpdateRequestDto } from './dtos/commentLIke.update.dto';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLikes)
    private readonly commentLikeRepository: Repository<CommentLikes>,
    private readonly usersService: UsersService,
  ) {}

  async updateCommentLike(
    commentLikeUpdateRequestDto: CommentLikeUpdateRequestDto,
  ) {
    const user = await this.usersService.findById(
      commentLikeUpdateRequestDto.userIdx,
    );

    const existCommentLikes = await this.commentLikeRepository.findBy({
      commentIdx: commentLikeUpdateRequestDto.commentIdx,
      userIdx: user.userIdx,
    });

    if (!existCommentLikes[0]) {
      await this.commentLikeRepository.insert({
        userIdx: commentLikeUpdateRequestDto.userIdx,
        postIdx: commentLikeUpdateRequestDto.postIdx,
        commentIdx: commentLikeUpdateRequestDto.commentIdx,
      });

      return '댓글의 좋아요를 등록하였습니다.';
    } else {
      await this.commentLikeRepository.delete({
        userIdx: commentLikeUpdateRequestDto.userIdx,
        postIdx: commentLikeUpdateRequestDto.postIdx,
        commentIdx: commentLikeUpdateRequestDto.commentIdx,
      });

      return '댓글의 좋아요를 취소하였습니다.';
    }
  }
}
