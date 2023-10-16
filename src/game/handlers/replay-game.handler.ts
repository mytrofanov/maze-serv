import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { ReplayGamePayDto } from '../dtos';
import { GameStatus } from '../game.model';

export const handleReplayGame =
    (gameService: GameService) =>
    async (client: any, payload: ReplayGamePayDto): Promise<any> => {
        const { gameId } = payload;
        const gameToReplay = await gameService.findGameForReplay(gameId);

        if (!gameToReplay || gameToReplay.status !== GameStatus.REPLAY_MODE) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Error occurred while replaying game with id ${gameId}`,
            });
        } else {
            client.emit(SocketEvents.GAME_TO_REPLAY, { game: gameToReplay });
        }
    };
