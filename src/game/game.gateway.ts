import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users';
import { GameLogService } from '../game-log';
import { DirectionPayload, GameExitPayload, GiveUpPayload, MessagePayload, SocketEvents } from './socket-types';
import * as process from 'process';
import 'dotenv/config';
import {
    handleConnectGame,
    handleConnection,
    handleCreateGame,
    handleCreateLog,
    handleCreateUser,
    handleDirectionChange,
    handleExit,
    handleGiveUp,
} from './handlers';
import { ConnectToGamePayloadDto, CreateGameDto } from './dtos';
import { MazeService } from '../maze/maze.service';

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
        private readonly mazeService: MazeService,
    ) {}

    //CONNECTION
    async handleConnection(client: any, ...args: any[]) {
        await handleConnection(this.gameService, this.usersService, this.server)(client, ...args);
    }

    //CREATE_GAME
    @SubscribeMessage(SocketEvents.CREATE_GAME)
    async handleCreateGame(client: any, payload: CreateGameDto): Promise<any> {
        await handleCreateGame(this.gameService, this.mazeService, this.server)(client, payload);
    }

    //CONNECT_GAME
    @SubscribeMessage(SocketEvents.CONNECT_GAME)
    async handleConnectGame(client: any, payload: ConnectToGamePayloadDto): Promise<any> {
        await handleConnectGame(this.gameService, this.mazeService, this.server)(client, payload);
    }

    //HANDLE DIRECTION CHANGE
    @SubscribeMessage(SocketEvents.DIRECTION)
    async handleDirectionChange(client: any, payload: DirectionPayload): Promise<any> {
        await handleDirectionChange(this.gameService, this.logService, this.mazeService, this.server)(client, payload);
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
        await handleExit(this.gameService, this.server)(client, payload);
    }

    //CREATE_USER
    @SubscribeMessage(SocketEvents.CREATE_USER)
    async handleCreateUser(client: any, payload: { userName: string }): Promise<any> {
        await handleCreateUser(this.usersService)(client, payload);
    }
}
