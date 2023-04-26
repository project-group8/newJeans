import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Tokens } from 'src/entities/Tokens.entity';
import { Users } from 'src/entities/Users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users, 'mysql')
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Tokens, 'mysql')
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

}
