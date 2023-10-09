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
    SUCCESS = 'SUCCESS',
}

export enum SocketErrorCodes {
    USERNAME_REQUIRED = 'USERNAME_REQUIRED',
    USERNAME_TAKEN = 'USERNAME_TAKEN',
    PLAYER_IS_NOT_FOUND = 'PLAYER_IS_NOT_FOUND',
    GAME_NOT_CREATED = 'GAME_NOT_CREATED',
}

export enum SocketSuccessCodes {
    USER_CREATED = 'USER_CREATED',
}
