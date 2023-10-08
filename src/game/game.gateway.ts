import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { Direction } from '../lib/mazes';

export enum ErrorCodes {
    USERNAME_REQUIRED = 'USERNAME_REQUIRED',
    USERNAME_TAKEN = 'USERNAME_TAKEN',
}

export enum SuccessCodes {
    USER_CREATED = 'USER_CREATED',
}

@WebSocketGateway() // can choose port @WebSocketGateway(4001), for example
export class GameGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly usersService: UsersService,
    ) {}

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client);
        console.log('args[0]:', args[0]);

        const userName = args[0]?.userName;
        if (!userName) {
            client.emit('error', { code: ErrorCodes.USERNAME_REQUIRED, message: 'Username is required' });
            client.disconnect();
            return;
        }

        const user = await this.usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit('error', {
                code: ErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            client.disconnect();
            return;
        } else {
            client.emit('success', {
                code: SuccessCodes.USER_CREATED,
                message: 'User successfully created.',
                payload: {
                    user: user,
                },
            });
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

    @SubscribeMessage('direction')
    async handleDirectionChange(client: any, payload: { direction: Direction }): Promise<any> {
        const { direction } = payload;

        const user = await this.usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit('error', {
                code: ErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            return;
        }

        client.emit('success', {
            code: SuccessCodes.USER_CREATED,
            message: 'User successfully created.',
            payload: {
                user: user,
            },
        });
    }

    @SubscribeMessage('createUser')
    async handleCreateUser(client: any, payload: { userName: string }): Promise<any> {
        const { userName } = payload;

        if (!userName) {
            client.emit('error', { code: ErrorCodes.USERNAME_REQUIRED, message: 'Username is required' });
            return;
        }

        const user = await this.usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit('error', {
                code: ErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            return;
        }

        client.emit('success', {
            code: SuccessCodes.USER_CREATED,
            message: 'User successfully created.',
            payload: {
                user: user,
            },
        });
    }
}
