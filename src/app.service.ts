import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is Maze Game, and this App use WebSockets! Connect with io from socket.io-client';
  }
}
