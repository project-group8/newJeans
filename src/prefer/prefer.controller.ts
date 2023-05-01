import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PreferService } from './prefer.service';
import { CreatePollValidPipe } from './pipes/prefer.pipe';
import { CreatePollDto } from './dto/prefer.dto';
import { UUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';

@Controller('prefer')
export class PreferController {
  constructor(private preferService: PreferService) {}

  /**
   * 1. 투표 결과를 봅니다.
   * @param postIdx
   * @returns
   */
  @Get('/post/:postIdx')
  async postPollResult(@Param('postIdx') postIdx: UUID): Promise<object> {
    const pollResult: object = await this.preferService.postPollResult(postIdx);

    return { pollResult: pollResult };
  }

  /**
   * 2. 상세 페이지 투표하기
   * @param payload
   * @param postIdx
   * @param createPollDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Put('/post/:postIdx')
  async createPostPoll(
    @GetPayload() payload: JwtPayload,
    @Param('postIdx') postIdx: UUID,
    @Body(CreatePollValidPipe) createPollDto: CreatePollDto,
  ): Promise<object> {
    const userIdx: UUID = payload.sub;
    const pollResult: number = await this.preferService.createPostPoll(
      userIdx,
      postIdx,
      createPollDto,
    );

    return { pollResult: pollResult };
  }
}
