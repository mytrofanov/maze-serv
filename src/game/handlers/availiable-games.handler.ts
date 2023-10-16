import { SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';

export const handleSendAvailableGames =
    (gameService: GameService, server: Server) =>
    async (client: any, payload: { userId: string }): Promise<any> => {
        const availableGames = await gameService.getAvailableGames();
        server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);

        const completedGames = await gameService.findCompletedGames(Number(payload.userId));
        server.emit(SocketEvents.COMPLETED_GAMES, completedGames);
    };
