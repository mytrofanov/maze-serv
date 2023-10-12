import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { MazeCellService } from '../../cell/cell.service';
import { Server } from 'socket.io';
import { CreateGameDto } from '../dtos';

export const handleCreateGame =
    (gameService: GameService, mazeCellService: MazeCellService, server: Server) =>
    async (client: any, payload: CreateGameDto): Promise<any> => {
        const newGame = await gameService.createGame(payload);
        const newMaze = await mazeCellService.createRandomMaze(newGame.id);

        if (!newGame || !newMaze) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_CREATED,
                message: 'Error occurred while creating game',
            });
        } else {
            client.emit(SocketEvents.GAME_CREATED, { game: newGame, maze: newMaze });
        }

        const availableGames = await gameService.getAvailableGames();
        if (availableGames && availableGames.length) {
            server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
        } else {
            server.emit(SocketEvents.AVAILABLE_GAMES, []);
        }
    };
