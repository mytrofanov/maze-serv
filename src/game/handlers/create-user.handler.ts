import { SocketErrorCodes, SocketEvents, SocketSuccessCodes } from '../socket-types';
import { UsersService } from '../../users';

export const handleCreateUser =
    (usersService: UsersService) =>
    async (client: any, payload: { userName: string }): Promise<any> => {
        const { userName } = payload;

        if (!userName) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_REQUIRED,
                message: 'Username is required',
            });
            return;
        }

        const user = await usersService.createUserIfNotExists({ userName: userName });
        if (!user) {
            client.emit(SocketEvents.ERROR, {
                code: SocketErrorCodes.USERNAME_TAKEN,
                message: 'Username is already taken or another error occurred.',
            });
            return;
        }

        client.emit(SocketEvents.SUCCESS, {
            code: SocketSuccessCodes.USER_CREATED,
            message: 'User successfully created.',
            payload: {
                user: user,
            },
        });
    };
