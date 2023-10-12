import { ConnectToGamePayload, SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { MazeCellService } from '../../cell/cell.service';
import { Server } from 'socket.io';

export const handleConnectGame =
    (gameService: GameService, mazeCellService: MazeCellService, server: Server) =>
    async (client: any, payload: ConnectToGamePayload): Promise<any> => {
        const connectedGame = await gameService.connectToGame(payload);
        const maze = await mazeCellService.getMazeById(connectedGame.id);

        if (!connectedGame || !maze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.NETWORK_ERROR,
                message: 'Error occurred while connecting to game',
            });
        } else {
            server.emit(SocketEvents.GAME_UPDATED, { game: connectedGame, maze: maze });
        }
    };
