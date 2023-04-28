import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login.request.dto';
import { KakaoRequestDto } from './dtos/kakao.request.dto';

@Controller('auth')
export class AuthController {
  usersService: any;
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res() res: Response,
  ) {
    const { accessToken, nickname, userLevel } = await this.authService.login(
      loginRequestDto,
    );

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.status(200).json({ nickname, userLevel });
  }

  @Post('refresh')
  async accessTokenGenerateByRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const accessToken =
      await this.authService.accessTokenGenerateByRefreshToken(
        req.headers['authorization'],
      );
    console.log(accessToken);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.status(201).send('Created');
  }

  @Post('kakaoLogin')
  async kakaoAuth(
    @Body() kakaoRequestDto: KakaoRequestDto,
    @Res() res: Response,
  ) {
    const kakaoUser = await this.authService.kakaoAuth(kakaoRequestDto);
    res.setHeader('Authorization', `Bearer ${kakaoUser.authorization}`);
    res.json({ email: kakaoUser.email, nickname: kakaoUser.nickname  });
  }
}
