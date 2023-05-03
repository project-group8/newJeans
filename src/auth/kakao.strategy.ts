import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { config } from 'dotenv';
config();

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: 'a558b560602bb0e31eec3dcf9866557e',
      clientSecret: 'u8rQ5HJHR7WhNfSWqe7HJpqz2Hau4Iax',
      // callbackURL: 'http://localhost:3000/auth/kakao/redirect',
      callbackURL: 'http://hoonsoo.net/auth/kakao/redirect',

      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // console.log('accessToken' + accessToken);
    // console.log('refreshToken' + refreshToken);
    // console.log('프로필', profile);
    // console.log(profile._json.kakao_account.email);
    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
    };
  }
}
