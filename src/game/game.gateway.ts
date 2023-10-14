import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';
import { GameLogService } from '../game-log/game-log.service';
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

export interface PlayerConnection {
    socketId: string;
    gameId: number;
    userId: number;
}

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
    private connectionToGameMap = new Map<string, string>();
    private gameToConnectionMap = new Map<string, { player1SocketId: string; player2SocketId: string }>();

    //CONNECTION
    async handleConnection(client: any, ...args: any[]) {
        await handleConnection(this.gameService, this.usersService, this.server)(client, ...args);
    }

    //CREATE_GAME
    @SubscribeMessage(SocketEvents.CREATE_GAME)
    async handleCreateGame(client: any, payload: CreateGameDto): Promise<any> {
        // SET FIRSTPLAYER CONNECTION INFO
        // const newGameId = "exampleGameId";
        // this.connectionToGameMap.set(client.id, newGameId);
        // this.gameToConnectionMap.set(newGameId, {player1SocketId: client.id, player2SocketId: null});
        await handleCreateGame(this.gameService, this.mazeService, this.server)(client, payload);
    }

    //CONNECT_GAME
    @SubscribeMessage(SocketEvents.CONNECT_GAME)
    async handleConnectGame(client: any, payload: ConnectToGamePayloadDto): Promise<any> {
        // SET SECOND PLAYER CONNECTION INFO
        // const gameIdToJoin = 'exampleGameId';
        // this.connectionToGameMap.set(client.id, gameIdToJoin);
        // const players = this.gameToConnectionMap.get(gameIdToJoin);
        // this.gameToConnectionMap.set(gameIdToJoin, { ...players, player2SocketId: client.id });

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

    async handleDisconnect(client: any): Promise<any> {
        const gameId = this.connectionToGameMap.get(client.id);

        if (gameId) {
            const players = this.gameToConnectionMap.get(gameId);

            const opponentSocketId =
                players.player1SocketId === client.id ? players.player2SocketId : players.player1SocketId;

            if (opponentSocketId) {
                this.server.to(opponentSocketId).emit(SocketEvents.OPPONENT_DISCONNECTED);
            }

            // Optional: Remove the games and connections from the maps if they are not needed anymore
            // this.connectionToGameMap.delete(client.id);
            // this.gameToConnectionMap.delete(gameId);
        }
    }
}
