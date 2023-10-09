import { GameStatus } from './game.model';
import { Direction } from '../cell/cell.model';
import { PlayerType } from '../users/users.model';

export enum SocketEvents {
    AVAILABLE_GAMES = 'AVAILABLE_GAMES',
    CONNECT = 'CONNECT',
    CONNECT_GAME = 'CONNECT_GAME',
    CREATE_GAME = 'CREATE_GAME',
    CREATE_USER = 'CREATE_USER',
    DIRECTION = 'DIRECTION',
    DISCONNECT = 'DISCONNECT',
    ERROR = 'ERROR',
    GAME_CREATED = 'GAME_CREATED',
    GAME_CONNECTED = 'GAME_CONNECTED',
    GAME_UPDATED = 'GAME_UPDATED',
    LOG_UPDATED = 'LOG_UPDATED',
    SUCCESS = 'SUCCESS',
    SEND_MESSAGE = 'SEND_MESSAGE',
}

export interface MessagePayload {
    gameId: number;
    playerId: number;
    playerType: PlayerType;
    message: string;
}

export type CreateGamePayload = {
    player1Id: string;
};

export type ConnectToServerPayload = {
    userName: string;
    userId?: string;
};

export type ConnectToGamePayload = {
    gameId: number;
    userId: number;
};

export type CreateUserPayload = {
    userName: string;
};

export enum SocketSuccessCodes {
    USER_CREATED = 'USER_CREATED',
}

export type SocketSuccess = {
    code: SocketSuccessCodes;
    message: string;
    payload: never;
};

export enum SocketErrorCodes {
    USERNAME_REQUIRED = 'USERNAME_REQUIRED',
    USERNAME_TAKEN = 'USERNAME_TAKEN',
    PLAYER_IS_NOT_FOUND = 'PLAYER_IS_NOT_FOUND',
    GAME_NOT_CREATED = 'GAME_NOT_CREATED',
    ERROR_ON_CONNECT_TO_GAME = 'ERROR_ON_CONNECT_TO_GAME',
}

export type SocketError = {
    code: SocketErrorCodes;
    message: string;
};

export type Game = {
    id: number;
    player1Id: number;
    player2Id?: number;
    currentPlayer: PlayerType;
    winner: PlayerType;
    status: GameStatus;
    createdAt: string;
};

export interface DirectionPayload {
    direction: Direction;
    gameId: number;
    playerId: number;
    playerType: PlayerType;
    message?: string;
}
