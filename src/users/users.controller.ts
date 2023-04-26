import { Body, Post, Controller, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupReqeustDto } from './dtos/signup.dto';


@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService){

    }
    @Post('signup')
    async signup(@Body() data: SignupReqeustDto){
      return this.usersService.signup(data);
    }



}
