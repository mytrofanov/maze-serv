import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service'; // Якщо у вас є такий сервіс для роботи з моделлю Game

@WebSocketGateway() // використовуйте порт, наприклад, @WebSocketGateway(4001), якщо потрібно
export class GameGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: any) {
    console.log('Client connected:', client);

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