import { SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { GiveUpDto } from '../dtos';

export const handleGiveUp =
    (gameService: GameService, server: Server) =>
    async (client: any, payload: GiveUpDto): Promise<any> => {
        const { gameId, playerId } = payload;
        const updatedGame = await gameService.setLooser(gameId, playerId);

        server.emit(SocketEvents.GAME_UPDATED, { game: updatedGame });
    };
