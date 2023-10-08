import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';

export enum ErrorCodes {
  USERNAME_REQUIRED = 'USERNAME_REQUIRED',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
}

@WebSocketGateway() // can choose port @WebSocketGateway(4001), for example
export class GameGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService, private readonly usersService: UsersService) {}

  async handleConnection(client: any,  ...args: any[]) {
    console.log('Client connected:', client);
    console.log('args[0]:', args[0]);

    const userName = args[0]?.userName;
    if (!userName) {
      client.emit('error', { code: ErrorCodes.USERNAME_REQUIRED, message: 'Username is required' });
      client.disconnect();
      return;
    }

    const user  = await this.usersService.createUserIfNotExists({ userName: userName });
    if (!user) {
      client.emit('error', { code: ErrorCodes.USERNAME_TAKEN, message: 'Username is already taken or another error occurred.' });
      client.disconnect();
      return;
    } else {
      client.emit('success', 'User successfully created.');
    }

    const availableGames = await this.gameService.getAvailableGames();
    if (availableGames && availableGames.length) {
      client.emit('availableGames', availableGames);
    } else {
      client.emit('availableGames', []);
    }
  }


  @SubscribeMessage('createGame')
  async handleCreateGame(client: any, payload: any): Promise<any> {
    const newGame = await this.gameService.createGame(payload); // Ваш метод для створення нової гри
    client.emit('gameCreated', newGame);
  }
}
