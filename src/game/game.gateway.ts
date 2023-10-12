import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { newPosition } from '../utils';
import { GameLogService } from '../game-log/game-log.service';
import { MazeCellService } from '../cell/cell.service';
import {
    ConnectToGamePayload,
    CreateGamePayload,
    DirectionPayload,
    GameExitPayload,
    GiveUpPayload,
    MessagePayload,
    SocketErrorCodes,
    SocketEvents,
    SocketSuccessCodes,
} from './socket-types';
import { PlayerType } from '../users/users.model';
import * as process from 'process';
import 'dotenv/config';

console.log('CORS_URL: ', process.env.CORS_URL);
console.log('PORT = process.env.PORT : ', process.env.PORT);

@WebSocketGateway({
    cors: {
        origin: process.env.CORS_URL,
        credentials: true,
    },
}) // can choose port @WebSocketGateway(4001), for example
export class GameGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly usersService: UsersService,
        private readonly logService: GameLogService,
        private readonly mazeCellService: MazeCellService,
    ) {}

    //CONNECTION
    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.handshake.query);
        const connectionPayload = client.handshake.query;
        const { userName, userId } = connectionPayload;

        if (!userName) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_REQUIRED,
                message: 'Username is required',
            });
        }

        const user = await this.usersService.createUserIfNotExists({ userName: userName, userId: userId });
        if (!user) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
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
            this.server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
        } else {
            this.server.emit(SocketEvents.AVAILABLE_GAMES, []);
        }
    }

    //CREATE_GAME
    @SubscribeMessage(SocketEvents.CREATE_GAME)
    async handleCreateGame(client: any, payload: CreateGamePayload): Promise<any> {
        const newGame = await this.gameService.createGame(payload);
        const newMaze = await this.mazeCellService.createRandomMaze(newGame.id);

        if (!newGame || !newMaze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_CREATED,
                message: 'Error occurred while creating game',
            });
        }
        client.emit(SocketEvents.GAME_CREATED, { game: newGame, maze: newMaze });
        const availableGames = await this.gameService.getAvailableGames();
        if (availableGames && availableGames.length) {
            this.server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
        } else {
            this.server.emit(SocketEvents.AVAILABLE_GAMES, []);
        }
    }

    //CONNECT_GAME
    @SubscribeMessage(SocketEvents.CONNECT_GAME)
    async handleConnectGame(client: any, payload: ConnectToGamePayload): Promise<any> {
        const connectedGame = await this.gameService.connectToGame(payload);
        const maze = await this.mazeCellService.getMazeById(connectedGame.id);
        if (!connectedGame || !maze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.NETWORK_ERROR,
                message: 'Error occurred while connecting to game',
            });
        }
        this.server.emit(SocketEvents.GAME_UPDATED, { game: connectedGame, maze: maze });
    }

    //HANDLE DIRECTION CHANGE
    @SubscribeMessage(SocketEvents.DIRECTION)
    async handleDirectionChange(client: any, payload: DirectionPayload): Promise<any> {
        const { direction, gameId, playerId, message } = payload;
        const game = await this.gameService.findGame(gameId);
        if (!game) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Game with id ${gameId} not found`,
            });
        }
        if (game.currentPlayer === PlayerType.PLAYER1 && playerId !== game.player1Id) {
            console.log('Player2 cant make move, Player1 should make move');
            return;
        }
        if (game.currentPlayer === PlayerType.PLAYER2 && playerId !== game.player2Id) {
            console.log('Player1 cant make move, Player2 should make move');
            return;
        }

        const playerType = playerId === game.player1Id ? PlayerType.PLAYER1 : PlayerType.PLAYER2;
        const startPosition = await this.mazeCellService.findPlayerPosition(game.id, playerType);
        if (!startPosition) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.PLAYER_IS_NOT_FOUND,
                message: 'Player is not found on the maze',
            });
        }

        const updatedPosition = newPosition(direction, { x: startPosition.colX, y: startPosition.rowY });
        //CREATE LOG
        await this.logService.createLog(
            gameId,
            playerType,
            playerId,
            direction,
            updatedPosition.x,
            updatedPosition.y,
            message,
        );

        await this.mazeCellService.handleDirectionChange(gameId, direction, startPosition, updatedPosition, playerType);

        const updatedGameState = await this.gameService.togglePlayer(gameId);
        const updatedMaze = await this.mazeCellService.getMazeById(gameId);
        const allLogs = await this.logService.getGameLogs(gameId);

        this.server.emit(SocketEvents.LOG_UPDATED, allLogs);
        this.server.emit(SocketEvents.GAME_UPDATED, { game: updatedGameState, maze: updatedMaze });
    }

    //SEND_MESSAGE
    @SubscribeMessage(SocketEvents.SEND_MESSAGE)
    async handleCreateLog(client: any, payload: MessagePayload): Promise<any> {
        const { gameId, playerId, playerType, message } = payload;

        await this.logService.createLog(gameId, playerType, playerId, undefined, undefined, undefined, message);

        const allLogs = await this.logService.getGameLogs(gameId);

        this.server.emit(SocketEvents.LOG_UPDATED, allLogs);
    }

    //GIVE UP
    @SubscribeMessage(SocketEvents.GIVE_UP)
    async handleGiveUp(client: any, payload: GiveUpPayload): Promise<any> {
        const { gameId, playerId } = payload;
        const game = await this.gameService.findGame(gameId);
        const updatedGame = await this.gameService.setWinner(
            game.id,
            game.player1Id === playerId ? PlayerType.PLAYER2 : PlayerType.PLAYER1,
        );

        this.server.emit(SocketEvents.GAME_UPDATED, { game: updatedGame });
    }

    //EXIT
    @SubscribeMessage(SocketEvents.EXIT)
    async handleExit(client: any, payload: GameExitPayload): Promise<any> {
        const { gameId, playerId } = payload;
        const game = await this.gameService.exitGame(gameId, playerId);

        this.server.emit(SocketEvents.GAME_UPDATED, { game });
    }

    //CREATE_USER
    @SubscribeMessage(SocketEvents.CREATE_USER)
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
