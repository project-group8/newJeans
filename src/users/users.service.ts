import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { Repository } from 'typeorm';
import { SignupReqeustDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findById(userIdx: UUID) {
    return await this.usersRepository.findOne({ where: { userIdx: userIdx } });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async signup(data: SignupReqeustDto): Promise<Users> {
    const email = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (email) throw new ConflictException('이미 존재하는 이메일 입니다.');

    const nickname = await this.usersRepository.findOne({
      where: { nickname: data.nickname },
    });

    if (nickname && data.provider === 'local')
      throw new ConflictException('이미 존재하는 닉네임 입니다.');

    const hashedPassword =
      data.provider === 'local' ? await bcrypt.hash(data.password, 12) : null;

    const nicknameOrEmail = data.nickname
      ? data.nickname
      : data.email
      ? data.email
      : false;

    // if (!nicknameOrEmail)
    // throw new BadRequestException('올바르지 않은 데이터 형식입니다.');

    // const nicknameRegexp = /^[a-zA-Z0-9]{3,10}$/g;
    // const emailRegexp =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // const isCorrect = nicknameRegexp.test(nicknameOrEmail)
    // ? { nickname: nicknameOrEmail }
    // : emailRegexp.test(nicknameOrEmail)
    // ? { email: nicknameOrEmail }
    // : false;

    // if (!isCorrect)
    // throw new BadRequestException('올바르지 않은 데이터 형식입니다.');

    const insertedUser = await this.usersRepository.create({
      email: data.email,
      nickname: data.nickname,
      password: data.provider === 'local' ? hashedPassword : 'KAKAO',
      provider: data.provider,
    });

    await this.usersRepository.save(insertedUser);
    return insertedUser;
  }

  async leave(userIdx: UUID) {
    const leaveUser = await this.usersRepository.delete(userIdx);

    if (leaveUser.affected === 0)
      throw new BadRequestException('존재하지 않는 유저입니다.');

    return '탈퇴가 완료되었습니다.';
  }
}
