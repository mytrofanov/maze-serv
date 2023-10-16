import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { ReplayGamePayDto } from '../dtos';
import { MazeService } from '../../maze/maze.service';
import { GameStatus } from '../game.model';

export const handleReplayGame =
    (gameService: GameService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: ReplayGamePayDto): Promise<any> => {
        const { gameId } = payload;
        const gameToReplay = await gameService.findGame(gameId);

        if (!gameToReplay || gameToReplay.status !== GameStatus.COMPLETED) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Error occurred while replaying game with id ${gameId}`,
            });
        } else {
            server.emit(SocketEvents.GAME_TO_REPLAY, { game: gameToReplay });
        }
    };
