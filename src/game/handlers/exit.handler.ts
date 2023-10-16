import { SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { GameExitDto } from '../dtos';

export const handleExit =
    (gameService: GameService, server: Server) =>
    async (client: any, payload: GameExitDto): Promise<any> => {
        const { gameId, playerId } = payload;
        await gameService.exitGame(gameId, playerId);

        client.emit(SocketEvents.GAME_UPDATED);

        const availableGames = await gameService.getAvailableGames();
        server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);

        const completedGames = await gameService.findCompletedGames(playerId);
        server.emit(SocketEvents.COMPLETED_GAMES, completedGames);
    };
