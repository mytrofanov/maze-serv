export type SocketId = string;
export type GameId = string;

const connectionToGameMap = new Map<SocketId, SocketId>();
const gameToConnectionMap = new Map<GameId, { player1SocketId: SocketId; player2SocketId: SocketId }>();

export const saveConnectionInfoOnGameCreate = (socketId: string, gameId: string) => {
    connectionToGameMap.set(socketId, gameId);
    gameToConnectionMap.set(gameId, { player1SocketId: socketId, player2SocketId: null });
};

export const getConnectionInfoByGameId = (gameId: string) => {
    return gameToConnectionMap.get(gameId);
};

export const saveConnectionInfoOnGameConnect = (socketId: string, gameId: string) => {
    connectionToGameMap.set(socketId, gameId);
    const playersConnectionsIds = getConnectionInfoByGameId(gameId);
    gameToConnectionMap.set(gameId, { ...playersConnectionsIds, player2SocketId: socketId });
};
