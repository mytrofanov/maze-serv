import { SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { GameExitDto } from '../dtos';

export const handleExit =
    (gameService: GameService, server: Server) =>
    async (client: any, payload: GameExitDto): Promise<any> => {
        const { gameId, playerId } = payload;
        const game = await gameService.exitGame(gameId, playerId);

        client.emit(SocketEvents.GAME_UPDATED, { game });
    };
