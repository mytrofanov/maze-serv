import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { ConnectToGamePayloadDto } from '../dtos';
import { MazeService } from '../../maze/maze.service';

export const handleConnectGame =
    (gameService: GameService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: ConnectToGamePayloadDto): Promise<any> => {
        const connectedGame = await gameService.connectToGame(payload);
        const maze = await mazeService.getMazeById(connectedGame.id);

        if (!connectedGame || !maze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.NETWORK_ERROR,
                message: 'Error occurred while connecting to game',
            });
        } else {
            server.emit(SocketEvents.GAME_UPDATED, { game: connectedGame, maze: maze });
        }
    };
