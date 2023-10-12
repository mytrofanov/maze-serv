import { GiveUpPayload, SocketEvents } from '../socket-types';
import { PlayerType } from '../../users/users.model';
import { GameService } from '../game.service';
import { Server } from 'socket.io';

export const handleGiveUp =
    (gameService: GameService, server: Server) =>
    async (client: any, payload: GiveUpPayload): Promise<any> => {
        const { gameId, playerId } = payload;
        const game = await gameService.findGame(gameId);
        const updatedGame = await gameService.setWinner(
            game.id,
            game.player1Id === playerId ? PlayerType.PLAYER2 : PlayerType.PLAYER1,
        );

        server.emit(SocketEvents.GAME_UPDATED, { game: updatedGame });
    };
