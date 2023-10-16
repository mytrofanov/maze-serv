import { SocketErrorCodes, SocketEvents } from '../socket-types';
import { GameService } from '../game.service';
import { GameLogService } from '../../game-log/game-log.service';
import { Server } from 'socket.io';
import { PlayerType } from '../../users/users.model';
import { newPosition } from '../../utils';
import { DirectionDto } from '../dtos';
import { MazeService } from '../../maze/maze.service';

export const handleDirectionChange =
    (gameService: GameService, logService: GameLogService, mazeService: MazeService, server: Server) =>
    async (client: any, payload: DirectionDto): Promise<any> => {
        const { direction, gameId, playerId, message } = payload;
        const game = await gameService.findGame(gameId);

        if (!game) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.GAME_NOT_FOUND,
                message: `Game with id ${gameId} not found`,
            });
            return;
        }

        //CHECK WHO CAN MAKE MOVE
        if (game.currentPlayer === PlayerType.PLAYER1 && playerId !== game.player1Id) {
            console.log('Player2 cant make move, Player1 should make move');
            return;
        }
        if (game.currentPlayer === PlayerType.PLAYER2 && playerId !== game.player2Id) {
            console.log('Player1 cant make move, Player2 should make move');
            return;
        }

        //FIND PLAYER
        const playerType = playerId === game.player1Id ? PlayerType.PLAYER1 : PlayerType.PLAYER2;
        const startPosition = await mazeService.findPlayerPosition(game, playerType);
        if (!startPosition) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.PLAYER_IS_NOT_FOUND,
                message: 'Player is not found on the maze',
            });
        }

        //FIND NEXT POSITION
        const updatedPosition = newPosition(direction, { x: startPosition.x.colX, y: startPosition.y.rowY });

        await mazeService.handleDirectionChange(
            game,
            direction,
            startPosition.y,
            startPosition.x,
            updatedPosition,
            playerType,
        );

        const updatedGameState = await gameService.togglePlayer(gameId);
        const updatedMaze = await mazeService.getMazeById(gameId);
        const gameStateSnapShot = JSON.stringify(updatedMaze.rows); //FOR REPLAY
        //CREATE LOG
        await logService.createLog(
            gameId,
            playerType,
            playerId,
            direction,
            updatedPosition.x,
            updatedPosition.y,
            message,
            gameStateSnapShot,
        );

        const allLogs = await logService.getGameLogs(gameId);
        server.emit(SocketEvents.LOG_UPDATED, allLogs);
        server.emit(SocketEvents.GAME_UPDATED, { game: updatedGameState, maze: updatedMaze });
    };
