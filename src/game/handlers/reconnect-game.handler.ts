import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { GameLogService } from '../../game-log/game-log.service';
import { Server } from 'socket.io';
import { MazeService } from '../../maze/maze.service';

export const handleReconnect =
    (gameService: GameService, logService: GameLogService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: { gameId: string } | null): Promise<any> => {
        console.log('handleReconnect: ', payload);
        const { gameId } = payload;
        const game = await gameService.findGame(Number(gameId));
        if (!game) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Game with id ${gameId} not found`,
            });
            return;
        }

        const updatedMaze = await mazeService.getMazeById(game.id);

        const allLogs = await logService.getGameLogs(game.id);
        server.emit(SocketEvents.LOG_UPDATED, allLogs);
        server.emit(SocketEvents.GAME_UPDATED, { game: game, maze: updatedMaze });
    };
