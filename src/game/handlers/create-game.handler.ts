import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { Server } from 'socket.io';
import { CreateGameDto } from '../dtos';
import { MazeService } from '../../maze/maze.service';
import { saveConnectionInfoOnGameCreate } from '../../utils';

export const handleCreateGame =
    (gameService: GameService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: CreateGameDto): Promise<any> => {
        const newGame = await gameService.createGame(payload);
        const newMaze = await mazeService.createRandomMaze(newGame.id);
        const gameWithMaze = await gameService.updateGame(newGame.id, {
            mazeId: newMaze.id,
            maze: newMaze,
        });

        if (!gameWithMaze || !newMaze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_CREATED,
                message: 'Error occurred while creating game',
            });
        } else {
            client.emit(SocketEvents.GAME_CREATED, { game: gameWithMaze, maze: newMaze });
        }

        // SAVE FIRST PLAYER CONNECTION INFO
        saveConnectionInfoOnGameCreate(client.id, newGame.id.toString());

        const availableGames = await gameService.getAvailableGames();
        server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
    };
