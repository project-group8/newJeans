import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { PreferService } from './prefer.service';
import { CreatePollValidPipe } from './pipes/prefer.pipe';
import { CreatePollDto } from './dto/prefer.dto';
import { UUID } from 'crypto';

@Controller('prefer')
export class PreferController {
  constructor(private preferService: PreferService) {}

  @Get('/post/:postIdx')
  async postPollResult(@Param('postIdx') postIdx: UUID): Promise<object> {
    const postPollResult: object = await this.preferService.postPollResult(
      postIdx,
    );

    return { pollResult: postPollResult };
  }

  // 미완성
  // authmiddle 만들기
  @Put('/post/:postIdx')
  async createPostPoll(
    @Param('postIdx') postIdx: UUID,
    @Body(CreatePollValidPipe) createPollDto: CreatePollDto,
    @Req() request: string,
  ): Promise<object> {
    // const { email } = request;
    // const {userIdx} = await this.cardpostsService.findUser(email)
    const createPostPoll: number = await this.preferService.createPostPoll(
      postIdx,
      createPollDto,
    );

    return { msg: createPostPoll };
  }
}
