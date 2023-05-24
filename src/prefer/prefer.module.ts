import { Module } from '@nestjs/common';
import { PreferController } from './prefer.controller';
import { PreferService } from './prefer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prefers } from '../entities/Prefers.entity';
import { CardPosts } from '../entities/CardPosts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prefers, CardPosts])],
  controllers: [PreferController],
  providers: [PreferService],
})
export class PreferModule {}
