import { SocketErrorCodes, SocketEvents, SocketSuccessCodes } from '../socket-types';
import { GameService } from '../game.service';
import { UsersService } from '../../users/users.service';
import { Server } from 'socket.io';

export const handleConnection =
    (gameService: GameService, usersService: UsersService, server: Server) =>
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
        if (availableGames && availableGames.length) {
            server.emit(SocketEvents.AVAILABLE_GAMES, availableGames);
        } else {
            server.emit(SocketEvents.AVAILABLE_GAMES, []);
        }
    };
