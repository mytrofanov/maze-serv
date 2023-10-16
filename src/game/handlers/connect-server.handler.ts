import { SocketErrorCodes, SocketEvents, SocketSuccessCodes } from '../socket-types';
import { GameService } from '../game.service';
import { UsersService } from '../../users/users.service';
import { Server } from 'socket.io';
import { MazeService } from '../../maze/maze.service';
import { GameLogService } from '../../game-log/game-log.service';

export const handleConnection =
    (
        gameService: GameService,
        usersService: UsersService,
        mazeService: MazeService,
        logService: GameLogService,
        server: Server,
    ) =>
    async (client: any, ...args: any[]) => {
        console.log('Client connected:', client.handshake.query);
        const connectionPayload = client.handshake.query;
        const { userName, userId } = connectionPayload;

        if (!userName) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_REQUIRED,
                message: 'Username is required',
            });
        }

        const user = await usersService.createUserIfNotExists({ userName: userName, userId: userId });
        if (!user) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
        } else {
            client.emit(SocketEvents.SUCCESS, {
                code: SocketSuccessCodes.USER_CREATED,
                message: 'User successfully created.',
                payload: {
                    user: user,
                },
            });
        }

        const availableGames = await gameService.getAvailableGames();
        server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);

        if (user) {
            const completedGames = await gameService.findCompletedGames(user.id);
            server.emit(SocketEvents.COMPLETED_GAMES, completedGames);

            //CHECK IF RECONNECT
            const lastGameInProgress = await gameService.findGameInProgress(user.id);
            if (lastGameInProgress) {
                const maze = await mazeService.getMazeById(lastGameInProgress.id);
                const allLogs = await logService.getGameLogs(lastGameInProgress.id);

                server.emit(SocketEvents.LOG_UPDATED, allLogs);
                server.emit(SocketEvents.GAME_UPDATED, { game: lastGameInProgress, maze: maze });
            }
        }
    };
