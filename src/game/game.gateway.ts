import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
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
import * as process from 'process';
import 'dotenv/config';
import {
    handleConnectGame,
    handleConnection,
    handleCreateGame,
    handleCreateLog,
    handleDirectionChange,
    handleGiveUp,
} from './handlers';

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
        await handleConnection(this.gameService, this.usersService, this.server)(client, ...args);
    }

    //CREATE_GAME
    @SubscribeMessage(SocketEvents.CREATE_GAME)
    async handleCreateGame(client: any, payload: CreateGamePayload): Promise<any> {
        await handleCreateGame(this.gameService, this.mazeCellService, this.server)(client, payload);
    }

    //CONNECT_GAME
    @SubscribeMessage(SocketEvents.CONNECT_GAME)
    async handleConnectGame(client: any, payload: ConnectToGamePayload): Promise<any> {
        await handleConnectGame(this.gameService, this.mazeCellService, this.server)(client, payload);
    }

    //HANDLE DIRECTION CHANGE
    @SubscribeMessage(SocketEvents.DIRECTION)
    async handleDirectionChange(client: any, payload: DirectionPayload): Promise<any> {
        await handleDirectionChange(
            this.gameService,
            this.logService,
            this.mazeCellService,
            this.server,
        )(client, payload);
    }

    //SEND_MESSAGE
    @SubscribeMessage(SocketEvents.SEND_MESSAGE)
    async handleCreateLog(client: any, payload: MessagePayload): Promise<any> {
        await handleCreateLog(this.logService, this.server)(client, payload);
    }

    //GIVE UP
    @SubscribeMessage(SocketEvents.GIVE_UP)
    async handleGiveUp(client: any, payload: GiveUpPayload): Promise<any> {
        await handleGiveUp(this.gameService, this.server)(client, payload);
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
