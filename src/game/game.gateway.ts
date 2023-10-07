import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service'; // Якщо у вас є такий сервіс для роботи з моделлю Game

@WebSocketGateway() // використовуйте порт, наприклад, @WebSocketGateway(4001), якщо потрібно
export class GameGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: any) {
    //console.log('Client connected:', client.id);
    console.log('Client connected:', client);
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(client: any, payload: any): Promise<any> {
    const newGame = await this.gameService.create(); // Ваш метод для створення нової гри
    client.emit('gameCreated', newGame);
  }
}
