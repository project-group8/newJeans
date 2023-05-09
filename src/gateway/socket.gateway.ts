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

interface User {
  id: string;
  name: string;
  room: string;
  maxParty: number;
  isAdmin?: boolean;
}
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
    private chatSavesRepository: Repository<ChatSaves>,
  ) {}
  @WebSocketServer()
  server: Server;

  private sessionExpirations: Map<string, NodeJS.Timeout> = new Map();
  private sessions: Record<string, Socket> = {};
  rooms: Record<string, { messages: any }> = {};
  users: any[] = [];
  chatLogs: Record<string, string[]> = {};

  // This is the function that will be called when a user joins a room
  addUser = ({ id, name, room, maxParty }) => {
    // Check for existing user
    const existingUser = this.users.find(
      (user) => user.room === room && user.name === name,
    );

    // Validate name and room
    if (!name || !room) return { error: '이름과 방이 필요해요.' };

    // Validate username
    if (existingUser) {
      return { error: '이미 존재하는 이름입니다..' };
    }

    // Store user
    const user: User = { id, name, room, maxParty };
    this.users.push(user);

    if (!this.rooms[room]) {
      this.rooms[room] = { messages: [] };
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }

    return { user };
  };

  // This is the function that will be called when a user leaves a room
  removeUser = (id) => {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  };

  // This is the function that will be called when a user sends a message
  getUser = (id) => this.users.find((user) => user.id === id);

  // This is the function that will be called when a user sends a message
  getUsersInRoom = (room) => this.users.filter((user) => user.room === room);

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody()
    { name, room, maxParty }: { name: string; room: string; maxParty: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Received join event with:', { name, room, maxParty });

    const { error, user } = this.addUser({
      id: socket.id,
      name,
      room,
      maxParty,
    });

    const numUsers = this.getUsersInRoom(user.room).length;

    socket.emit('currParty', {
      numUsers: `${numUsers}`,
      room: `${user.room}`,
      maxParty: `${maxParty}`,
    });

    if (!!(user.maxParty <= numUsers) == false) {
      return {
        error: '방이 가득 찼습니다. 다른 방을 이용해 주세요.',
      };
    }

    // 해당 방에 유저 추가 합니다.
    socket.join(user.room);

    const sessionId = socket.handshake.query.t;

    socket.emit('sessionId', {
      sessionId: sessionId,
      text: `${user.name} has ${sessionId}`,
    });

    if (!this.rooms[user.room]) {
      this.rooms[user.room] = { messages: [] };
    }

    socket.emit('message', {
      user: 'hunsuBot',
      text: `${user.name}님, ${user.room}에 오신 것을 환영합니다. `,
    });

    this.server.to(user.room).emit('roomData', {
      room: user.room,
      users: this.getUsersInRoom(user.room),
      messages: this.rooms[user.room].messages,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { message }: { message: string },
  ) {
    const user = this.getUser(socket.id);
    if (!user) {
      return;
    }
    const room = user.room;
    if (!this.rooms[room]) {
      this.rooms[room] = { messages: [] };
    }

    this.rooms[room].messages.push({ user: user.name, text: message });

    // rooms[room].messages.push({ name: user.name, message: message });

    // this.server
    //   .to(room)
    //   .emit('server_message', { user: user.name, text: message });

    socket.emit('server_message', { user: user.name, text: message });

    // io.to(room).emit("message", { name: user.name, message: message });
    // 채팅 불러오기 트라이

    // 채팅 불러오기 트라이
  }

  handleConnection(socket: Socket, ...args: any[]) {
    const sessionId = socket.handshake.query.t;
    if (typeof sessionId === 'string' && this.sessions[sessionId]) {
      // 기존 세션 ID로 새 소켓을 교체
      this.sessions[sessionId].disconnect();
      this.sessions[sessionId] = socket;
      console.log(
        `Session ${sessionId} reconnected. with new socket ${socket.id}`,
      );

      // 존재하는 세션 만료 시간을 취소
      clearTimeout(this.sessionExpirations.get(sessionId));
    } else {
      // 새로운 세션 생성
      this.sessions[socket.id] = socket;
      console.log(`New session ${socket.id}이 생성되었습니다.`);
    }
    // 세션 만료 시간 스케줄링 (1시간 후)
    const expirationTimeout = setTimeout(() => {
      this.sessions[socket.id].disconnect();
      delete this.sessions[socket.id];
      this.sessionExpirations.delete(socket.id);
      console.log(`Session ${socket.id} expired`);
    }, 60 * 60 * 1000); // 1시간 (60분 * 60초 * 1000밀리초)

    this.sessionExpirations.set(socket.id, expirationTimeout);
  }

  // handleConnection(client: Socket, ...args: any[]) {
  //   console.log(`Client connected: ${client.id}`);
  // }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('유저 연결 해제');

    const user = this.removeUser(socket.id);
    if (user) {
      console.log(`${user.name}이(가) 방을 나갔습니다.`);
      const room = user.room;
      const isAdmin = user.isAdmin;

      if (this.getUsersInRoom(room).length === 0 || isAdmin) {
        const saveData = this.rooms[room].messages;
        const nickname = user.name;
        try {
          const chatSave = this.chatSavesRepository.create({
            saveData,
            nickname,
            room,
          });
          await this.chatSavesRepository.save(chatSave);
          `${room} 방 채팅 저장에 성공했습니다.`;
        } catch (error) {
          console.log(`${room} 방 채팅 저장에 실패했습니다.`);
        }

        console.log(`${room} 방이 삭제되었습니다.`);
        delete this.rooms[room];
      }
    }
  }
}

// else {
//   this.server.to(room).emit('roomData', {
//     room: room,
//     users: this.getUsersInRoom(room),
//     messages: this.rooms[room].messages,
//   });
// }

// const usersInRoom = this.server.sockets.adapter.rooms.get(room);

// if (usersInRoom.size === 1) {
//   socket.emit('message', '첫번째로 방에 입장하셨습니다.');
// } else {
//   socket.emit('message', `현재 방의 인원은 ${usersInRoom.size}명 입니다.`);
// }

// if (!this.rooms[room]) {
//   this.rooms[room] = [];
// }
// // const user = this.addUser(socket.id, name, room, maxParty, isAdmin);
// if ('error' in user) {
//   return user;
// } else {
//   this.rooms[room].push({ id: socket.id, name });
// }

// socket.on("disconnect", () => {
//   const user = removeUser(socket.id);
//   if (user) {
//     console.log(`${user.name}이(가) 방을 나갔습니다.`);
//     const room = user.room;
//     if (getUsersInRoom(room).length === 0) {
//       console.log(`${room} 방이 삭제되었습니다.`);
//       delete rooms[room];
//     } else {
//       io.to(room).emit("roomData", {
//         room: room,
//         users: getUsersInRoom(room),
//         messages: rooms[room].messages,
//       })
//     }
//   }
// });

// for (const room in this.rooms) {
//   const index = this.rooms[room].findIndex((user) => user.id === socket.id);
//   if (index !== -1) {
//     const user = this.rooms[room][index];
//     if (user.isAdmin) {
//       // isAdmin삭제
//       const saveData = JSON.stringify(this.chatLogs[room]);
//       const nickname = user.name;

//       await this.chatSavesRepository.save({ saveData, nickname, room });
//       console.log('저장 성공');
//       delete this.rooms[room];
//       delete this.chatLogs[room];
//     } else {
//       this.rooms[room].splice(index, 1);
//     }
//   }
// }
