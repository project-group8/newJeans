import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardpostsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findOne() {
    const testtestes = await this.usersRepository.findOne({ where: {} });
    console.log(testtestes);
    return testtestes;
  }
}
