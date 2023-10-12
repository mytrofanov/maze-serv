import { MessagePayload, SocketEvents } from '../socket-types';
import { GameLogService } from '../../game-log/game-log.service';
import { Server } from 'socket.io';

export const handleCreateLog =
    (logService: GameLogService, server: Server) =>
    async (client: any, payload: MessagePayload): Promise<any> => {
        const { gameId, playerId, playerType, message } = payload;

        await logService.createLog(gameId, playerType, playerId, undefined, undefined, undefined, message);

        const allLogs = await logService.getGameLogs(gameId);

        server.emit(SocketEvents.LOG_UPDATED, allLogs);
    };
