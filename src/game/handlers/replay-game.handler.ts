import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { ReplayGamePayDto } from '../dtos';
import { GameStatus } from '../game.model';
import { GameLogService } from '../../game-log/game-log.service';

export const handleReplayGame =
    (gameService: GameService, logService: GameLogService, server: Server) =>
    async (client: any, payload: ReplayGamePayDto): Promise<any> => {
        const { gameId } = payload;
        const gameToReplay = await gameService.findGame(gameId);
        const allLogs = await logService.getGameLogs(gameToReplay.id);

        if (!gameToReplay || gameToReplay.status !== GameStatus.COMPLETED || allLogs) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Error occurred while replaying game with id ${gameId}`,
            });
        } else {
            client.emit(SocketEvents.GAME_TO_REPLAY, { game: gameToReplay });
            client.emit(SocketEvents.LOG_UPDATED, allLogs);
        }
    };
