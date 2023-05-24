import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Tokens } from '../entities/Tokens.entity';
import { Users } from '../entities/Users.entity';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './dtos/login.request.dto';
import * as bcrypt from 'bcrypt';
import { KakaoRequestDto } from './dtos/kakao.request.dto';
import axios from 'axios';
import { SignupReqeustDto } from '../users/dtos/signup.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async tokenFindByUserIdx(userIdx: UUID) {
    return await this.tokensRepository.findOne({ where: { userIdx } });
  }

  async refreshTokenFindByUserId(refreshToken: string) {
    const findToken = await this.tokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (!findToken)
      throw new UnauthorizedException('해당하는 토큰이 존재하지 않습니다.');

    const user = await this.usersRepository.findOne({
      where: { userIdx: findToken.userIdx },
    });

    return user.userIdx;
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async accessTokenGenerateByRefreshToken(accessToken: string) {
    if (!accessToken)
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');

    const [authTpye, authToken] = accessToken.split(' ');
    const payload = this.jwtService.decode(authToken);

    if (!(typeof payload === 'object'))
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');

    const token = await this.tokenFindByUserIdx(payload.sub);

    if (!token) throw new UnauthorizedException('잘못된 토큰입니다.');

    const validateRefreshToken = await this.validateRefreshToken(token.token);

    if (!validateRefreshToken)
      throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');

    const newAccessToken = await this.jwtService.signAsync(
      {
        userIdx: token.userIdx,
      },
      { expiresIn: '1h', secret: process.env.JWT_ACCESS_SECRET },
    );

    return newAccessToken;
  }

  async login(loginRequestDto: LoginRequestDto) {
    const { email, password } = loginRequestDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('존재하지 않는 이메일 입니다.');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('로그인에 실패하였습니다.');

    try {
      const accessToken = await this.jwtService.signAsync(
        { sub: user.userIdx },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1d' },
      );

      const existRefreshToken = await this.tokenFindByUserIdx(user.userIdx);

      if (existRefreshToken)
        await this.tokensRepository.delete({ userIdx: user.userIdx });

      const refreshToken = await this.jwtService.signAsync(
        {},
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      );

      await this.tokensRepository.insert({
        userIdx: user.userIdx,
        token: refreshToken,
      });

      return { accessToken, nickname: user.nickname, userLevel: user.level };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.messgae);
    }
  }

  // async createNickname(userIdx: UUID, data: { nickname: string }) {
  //   const nicknameRegexp = /^[a-zA-Z0-9]{3,10}$/g;
  //   if (!nicknameRegexp.test(data.nickname)) {
  //     throw new BadRequestException('올바르지 않은 데이터 형식입니다.');
  //   }

  //   const existNick = await this.usersRepository.findOne({
  //     where: { nickname: data.nickname },
  //   });

  //   if (existNick)
  //     throw new BadRequestException('이미지 존재하는 닉네임입니다.');

  //   const updateNickname = await this.usersRepository.update(
  //     { userIdx: userIdx },
  //     { nickname: data.nickname },
  //   );

  //   if (updateNickname.affected === 1) {
  //     const userData = await this.usersRepository.findOne({
  //       where: { userIdx: userIdx },
  //     });

  //     return { nickname: userData.nickname };
  //   } else {
  //     throw new BadRequestException('닉네임 등록에 실패했습니다.');
  //   }
  // }

  async kakaoLogin(token: string) {
    if (!token) {
      return 'No user from kakao';
    }

    return {
      message: 'User information from kakao',
      user: token,
    };
  }

  async kakaoAuth(kakaoRequestDto: KakaoRequestDto) {
    const getUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const axiosHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoRequestDto.accessToken}`,
    };

    const res = await axios({
      method: 'GET',
      url: getUserInfoUrl,
      timeout: 100000,
      headers: axiosHeaders,
    });

    console.log(res.data);
    console.log(
      '=================================================================',
    );
    console.log(res.data.id);
    console.log(
      '=================================================================',
    );
    const kakaoUser = res.data;
    const kakaoEmail = kakaoUser.kakao_account.email;
    const kakaoNickname = kakaoUser.properties.nickname;

    const user = await this.usersRepository.findOne({
      where: { email: kakaoEmail },
    });

    if (!user) {
      const newUserData = new SignupReqeustDto();
      newUserData.email = kakaoEmail;
      newUserData.nickname = kakaoNickname;
      newUserData.provider = 'kakao';

      const newUser = await this.usersService.signup(newUserData);

      const accessToken = await this.jwtService.signAsync(
        { sub: newUser.userIdx },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1d' },
      );

      return {
        email: kakaoEmail,
        nickname: newUserData.nickname,
        authorization: accessToken,
      };
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.userIdx },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1d' },
    );

    return {
      email: user.email,
      nickname: user.nickname,
      authorization: accessToken,
    };
  }
}
