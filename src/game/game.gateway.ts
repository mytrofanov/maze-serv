import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { Direction } from '../lib/mazes';
import { newPosition } from '../utils';
import { GameLogService } from '../game-log/game-log.service';
import { MazeCellService } from '../cell/cell.service';
import { SocketErrorCodes, SocketEvents, SocketSuccessCodes } from './socket-types';

export interface DirectionPayload {
    direction: Direction;
    gameId: number;
    playerId: number;
    message?: string;
}

@WebSocketGateway() // can choose port @WebSocketGateway(4001), for example
export class GameGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly usersService: UsersService,
        private readonly logService: GameLogService,
        private readonly mazeCellService: MazeCellService,
    ) {}

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client);
        console.log('args[0]:', args[0]);

        const userName = args[0]?.userName;
        if (!userName) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_REQUIRED,
                message: 'Username is required',
            });
            client.disconnect();
            return;
        }

        const user = await this.usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            client.disconnect();
            return;
        } else {
            client.emit(SocketEvents.SUCCESS, {
                code: SocketSuccessCodes.USER_CREATED,
                message: 'User successfully created.',
                payload: {
                    user: user,
                },
            });
        }

        const availableGames = await this.gameService.getAvailableGames();
        if (availableGames && availableGames.length) {
            client.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
        } else {
            client.emit(SocketEvents.AVAILABLE_GAMES, []);
        }
    }

    @SubscribeMessage('createGame')
    async handleCreateGame(client: any, payload: any): Promise<any> {
        const newGame = await this.gameService.createGame(payload);
        const newMaze = await this.mazeCellService.createRandomMaze(newGame.id);
        if (!newGame || newMaze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_CREATED,
                message: 'Error occurred while creating game',
            });
        }
        client.emit(SocketEvents.GAME_CREATED, { game: newGame, maze: newMaze });
    }

    @SubscribeMessage('direction')
    async handleDirectionChange(client: any, payload: DirectionPayload): Promise<any> {
        const { direction, gameId, playerId, message } = payload;
        const startPosition = await this.gameService.findPlayerPosition(gameId);

        if (!startPosition) {
            // console.log('Players are not found on maze');
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.PLAYER_IS_NOT_FOUND,
                message: 'Players are not found on maze.',
            });
        }
        const updatedPosition = newPosition(direction, startPosition.playerPosition);

        await this.logService.createLog(
            gameId,
            startPosition.currentPlayer,
            playerId,
            direction,
            updatedPosition.x,
            updatedPosition.y,
            message,
        );

        // saveLogs(currentPlayer, playerId, direction, newX, newY);

        client.emit(SocketEvents.SUCCESS, {
            code: SocketSuccessCodes.USER_CREATED,
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
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_REQUIRED,
                message: 'Username is required',
            });
            return;
        }

        const user = await this.usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            return;
        }

        client.emit(SocketEvents.SUCCESS, {
            code: SocketSuccessCodes.USER_CREATED,
            message: 'User successfully created.',
            payload: {
                user: user,
            },
        });
    }
}
