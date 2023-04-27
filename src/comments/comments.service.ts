import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CommentCreateRequestDto } from './dtos/comment.create.request.dto';
import { Users } from 'src/entities/Users.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments, 'mysql')
        private readonly commentsRepository: Repository<Comments>,
        // private readonly usersService: UsersService,
        @Inject(forwardRef(() => UsersService))
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
          commnetIdx: comment.commentIdx,
          userIdx: user.userIdx,
          comment: comment.comment,
          nickname: user.nickname,
          createdAt: comment.createdAt,
        };
      }


}
