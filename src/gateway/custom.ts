import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../auth/jwt/jwt.payload.dto';
import { Logger, BadRequestException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3001, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    exposedHeaders: ['Authorization'],
  },
})
export class DMGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
  @WebSocketServer() public server: Server;

  async handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('handleConnection=======================================');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('handleDisconnect=======================================');
  }

  @SubscribeMessage('join')
  async handleDms(
    @MessageBody() data: { message: string; content?: Buffer; sender: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(
      'handleDms=====================================================',
    );
  }
}
