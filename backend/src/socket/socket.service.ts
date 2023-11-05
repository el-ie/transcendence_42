import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
    constructor(private socketGateway: SocketGateway){}

    sendEvent(login: string, eventName: string, data: any){
        return (this.socketGateway.sendEvent(login, eventName, data));
    }
}
