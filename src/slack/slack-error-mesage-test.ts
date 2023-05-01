import { Controller, Get, BadRequestException } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('error')
  throwError() {
    throw new BadRequestException(
      'category, maincategory, splitNumber, splitPageNumber는 비어있을 수 없습니다.',
    );
  }
}
