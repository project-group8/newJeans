// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChatSaves } from 'src/entities/ChatSaves.entity';
// import { SocketGatewayService } from './socket.services';
// import { SocketGateway } from './socket.gateway';

// @Module({
//   imports: [TypeOrmModule.forFeature([ChatSaves])],
//   controllers: [],
//   providers: [SocketGatewayService],
// })
// export class SocketGatewayModule {}

import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSaves } from 'src/entities/ChatSaves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSaves])],
  providers: [SocketIoGateway],
})
export class SocketIoModule {}
