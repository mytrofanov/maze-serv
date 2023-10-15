import { SocketEvents } from '../socket-types';
import { getClientWithDisconnectedOpponent } from '../../utils';
import { Server } from 'socket.io';

export const sendMessageToOpponent =
    (server: Server) =>
    async (client: any): Promise<any> => {
        const opponentSocketId = getClientWithDisconnectedOpponent(client.id);
        if (opponentSocketId) {
            server.to(opponentSocketId).emit(SocketEvents.OPPONENT_DISCONNECTED);
        }
    };
