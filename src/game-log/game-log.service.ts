import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameLog, PlayerType, Direction } from './game-log.model';
import { Game } from '../game/game.model';

@Injectable()
export class GameLogService {
    constructor(
        @InjectModel(GameLog)
        private readonly gameLogModel: typeof GameLog,
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
    ) {}

    async createLog(
        gameId: number,
        currentPlayer: PlayerType,
        playerId: number,
        direction?: Direction,
        newX?: number,
        newY?: number,
        message?: string
    ): Promise<GameLog> {
        const created = new Date().toLocaleTimeString();
        const logMessage = message
            ? `${PlayerType[currentPlayer]} message: ${message} at ${created}`
            : `${PlayerType[currentPlayer]} going ${direction} at ${created}`;

        const log = {
            playerType: currentPlayer,
            playerId: playerId,
            direction: direction || null,
            position: newX && newY ? { x: newX, y: newY } : null,
            message: logMessage,
            created,
            gameId,  // Important add game ID
        };

        return this.gameLogModel.create(log);
    }
}
