import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { CreateGameDto } from '../dtos';
import { MazeService } from '../../maze/maze.service';

export const handleCreateGame =
    (gameService: GameService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: CreateGameDto): Promise<any> => {
        const newGame = await gameService.createGame(payload);
        const newMaze = await mazeService.createRandomMaze(newGame.id);

        if (!newGame || !newMaze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_CREATED,
                message: 'Error occurred while creating game',
            });
        } else {
            client.emit(SocketEvents.GAME_CREATED, { game: newGame, maze: newMaze });
        }

        const availableGames = await gameService.getAvailableGames();
        server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
    };
