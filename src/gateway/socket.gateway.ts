import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSaves } from 'src/entities/ChatSaves.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
    credentials: true,
  },
})
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(ChatSaves)
    private readonly chatSavesRepository: Repository<ChatSaves>,
  ) {}
  @WebSocketServer()
  server: Server;

  rooms: Record<string, any[]> = {};
  users: any[] = [];
  chatLogs: Record<string, string[]> = {};

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody()
    { name, room, maxParty }: { name: string; room: string; maxParty: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Received join event with:', { name, room, maxParty });
    socket.join(room);
    const usersInRoom = this.server.sockets.adapter.rooms.get(room);
    let isAdmin = false;
    if (usersInRoom.size === 1) {
      socket.emit('message', '첫번째로 방에 입장하셨습니다.');
      isAdmin = true;
    } else {
      socket.emit('message', `현재 방의 인원은 ${usersInRoom.size}명 입니다.`);
    }

    if (!this.rooms[room]) {
      this.rooms[room] = [];
    }
    const user = this.addUser(socket.id, name, room, maxParty, isAdmin);
    if ('error' in user) {
      return user;
    } else {
      this.rooms[room].push({ id: socket.id, name, isAdmin });
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, msg }: { room: string; msg: string },
  ) {
    this.server.to(room).emit('message', msg);

    if (!this.chatLogs[room]) {
      this.chatLogs[room] = [];
    }
    this.chatLogs[room].push(msg);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('유저 연결 해제');

    for (const room in this.rooms) {
      const index = this.rooms[room].findIndex((user) => user.id === socket.id);
      if (index !== -1) {
        const user = this.rooms[room][index];
        if (user.isAdmin) {
          const saveData = JSON.stringify(this.chatLogs[room]);
          const nickname = user.name;

          await this.chatSavesRepository.save({ saveData, nickname, room });
          console.log('저장 성공');
          delete this.rooms[room];
          delete this.chatLogs[room];
        } else {
          this.rooms[room].splice(index, 1);
        }
      }
    }
  }

  private addUser(
    id: string,
    name: string,
    room: string,
    maxParty: number,
    isAdmin: boolean,
  ) {
    const user = { id, name, room, maxParty, isAdmin };

    if (!id || !name || !room) {
      return { error: 'Username, room, ID가 없습니다.' };
    }

    this.users.push(user);

    return user;
  }
}
