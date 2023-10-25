import { SocketEvents } from '../socket-types';
import { GameLogService } from '../../game-log/game-log.service';
import { Server } from 'socket.io';
import { LogDto } from '../dtos';
import { GameService } from '../game.service';

export const handleCreateLog =
    (logService: GameLogService, gameService: GameService, server: Server) =>
    async (client: any, payload: LogDto): Promise<any> => {
        const { gameId, playerId, playerType, message } = payload;
        const game = await gameService.findGame(gameId);
        await logService.createLog(gameId, playerType, playerId, undefined, undefined, undefined, message, undefined);

        const allLogs = await logService.getGameLogs(gameId);

        if (!game.singlePlayerGame) {
            server.emit(SocketEvents.LOG_UPDATED, allLogs);
        } else {
            client.emit(SocketEvents.LOG_UPDATED, allLogs);
        }
    };
