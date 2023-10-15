export type SocketId = string;
export type GameId = string;

const connectionToGameMap = new Map<SocketId, SocketId>();
const gameToConnectionMap = new Map<GameId, { player1SocketId: SocketId; player2SocketId: SocketId }>();

export const saveConnectionInfoOnGameCreate = (socketId: SocketId, gameId: GameId) => {
    connectionToGameMap.set(socketId, gameId);
    gameToConnectionMap.set(gameId, { player1SocketId: socketId, player2SocketId: null });
};

export const saveConnectionInfoOnGameConnect = (socketId: SocketId, gameId: GameId) => {
    connectionToGameMap.set(socketId, gameId);
    const playersConnectionsIds = gameToConnectionMap.get(gameId);
    gameToConnectionMap.set(gameId, { ...playersConnectionsIds, player2SocketId: socketId });
};

export const getClientWithDisconnectedOpponent = (disconnectedSocketId: SocketId) => {
    const gameId = connectionToGameMap.get(disconnectedSocketId);
    if (gameId) {
        const players = gameToConnectionMap.get(gameId);

        const opponentSocketId =
            players.player1SocketId === disconnectedSocketId ? players.player2SocketId : players.player1SocketId;

        //CLEAR CONNECTION INFO
        connectionToGameMap.delete(disconnectedSocketId);
        gameToConnectionMap.delete(gameId);

        return opponentSocketId || null;
    }
};
