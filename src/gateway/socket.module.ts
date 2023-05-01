import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSaves } from 'src/entities/ChatSaves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSaves])],
  providers: [SocketIoGateway],
})
export class SocketIoModule {}
