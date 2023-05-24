import { Body, Post, Controller, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupReqeustDto } from './dtos/signup.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { GetPayload } from '../common/decorators/get.payload.decorator';
import { JwtPayload } from '../auth/jwt/jwt.payload.dto';

@Controller('user')
export class UsersController {
  authService: any;
  constructor(private usersService: UsersService) {}
  @Post('signup')
  async signup(@Body() data: SignupReqeustDto) {
    data.provider = data.provider ? data.provider : 'local';
    return this.usersService.signup(data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('leave')
  async leave(@GetPayload() payload: JwtPayload) {
    const userIdx = payload.sub;
    return await this.usersService.leave(userIdx);
  }
}
