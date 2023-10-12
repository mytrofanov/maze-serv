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
    EXIT = 'EXIT',
    GAME_CONNECTED = 'GAME_CONNECTED',
    GAME_CREATED = 'GAME_CREATED',
    GAME_UPDATED = 'GAME_UPDATED',
    GIVE_UP = 'GIVE_UP',
    LOG_UPDATED = 'LOG_UPDATED',
    SEND_MESSAGE = 'SEND_MESSAGE',
    SUCCESS = 'SUCCESS',
}

export interface MessagePayload {
    gameId: number;
    playerId: number;
    playerType: PlayerType;
    message: string;
}

export type GiveUpPayload = {
    gameId: number;
    playerId: number;
};

export type GameExitPayload = {
    gameId: number;
    playerId: number;
};

export type ConnectToGamePayload = {
    gameId: number;
    userId: number;
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
    GAME_NOT_FOUND = 'GAME_NOT_FOUND',
    NETWORK_ERROR = 'NETWORK_ERROR',
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
    message?: string;
}
