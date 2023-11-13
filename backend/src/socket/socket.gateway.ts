import { ModuleRef } from '@nestjs/core';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
} })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private moduleRef: ModuleRef, private prismaService: PrismaService){}
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  async handleConnection(client: Socket) {
    const username = client.handshake.query.username as string;
    const userService = this.moduleRef.get(UserService, {strict: false});
    await userService.connect(username);
    this.connectedClients.set(username, client);
    this.server.emit("connection");
  }

  async handleDisconnect(client: Socket) {

    const userService = this.moduleRef.get(UserService, {strict: false});
    for (const [username, socket] of this.connectedClients) {
      if (socket === client) {
        this.connectedClients.delete(username);
        await userService.disconnect(username);
        console.log("user disconnected");
        break;
      }
    }
    this.server.emit("connection");
  }

  sendEvent(username: string, eventName: string, data: any) {
    const socket = this.connectedClients.get(username);
    if (socket)
      socket.emit(eventName, data);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
      const channelService = this.moduleRef.get(ChannelService, {strict: false});
      const userService = this.moduleRef.get(UserService, {strict: false});
      const channelId = await channelService.getIdByName(payload.channelName);
      const userId = await userService.getIdByLogin(payload.senderLogin);
      try {
        const chanco = await this.prismaService.channelConnection.findFirstOrThrow({
          where :{
            userId,
            channelId,
          }
        })
        if (chanco.muted < (Math.floor(new Date().getTime() / 1000)))
        {
          console.log ("user " + payload.senderLogin + " is no muted until " + chanco.muted + '/' + Math.floor(new Date().getTime() / 1000));
          const messageservice = this.moduleRef.get(MessageService, { strict: false });
          const message = await messageservice.createMessage(payload.content, payload.senderLogin, payload.channelName);
          console.log('jenvoie le message');
          payload.userList.map((user: any) => {
              this.connectedClients.get(user.username).emit('message', message);
          })
        }
        else {
          console.log("userid " + chanco.userId + " is muted on chan " + chanco.channelId);
        }
      }
      catch (error) {
        console.log("erroooooor");
        throw (error);
      }
  }
}
