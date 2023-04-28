import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyComments } from 'src/entities/ReplyComments.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm/repository/Repository';
import { ReplyCommentCreateRequestDto } from './dtos/replycomments.create.request.dto';

@Injectable()
export class ReplycommentsService {
    constructor(
        @InjectRepository(ReplyComments)
        private readonly replycommentsRepository: Repository<ReplyComments>,
        private readonly usersService: UsersService,
    ) {}

    async createReplyComment(replycommentCreateRequestDto: ReplyCommentCreateRequestDto) {
        const replycomment = await this.replycommentsRepository.save({
          ...replycommentCreateRequestDto,
        });
    
        const user = await this.usersService.findById(
            replycommentCreateRequestDto.userIdx,
        );
    
    
        return {
          replyIdx: replycomment.replyIdx,
          userIdx: user.userIdx,
          comment: replycomment.comment,
          nickname: user.nickname,
          createdAt: replycomment.createdAt,
        };
    }


}
