import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameLog } from './game-log.model';
import { Direction } from '../cell/cell.model';
import { PlayerType } from '../users/users.model';

@Injectable()
export class GameLogService {
    constructor(
        @InjectModel(GameLog)
        private readonly gameLogModel: typeof GameLog,
    ) {}

    async createLog(
        gameId: number,
        currentPlayer: PlayerType,
        playerId: number,
        direction?: Direction,
        newX?: number,
        newY?: number,
        message?: string,
    ): Promise<GameLog> {
        const logMessage = message
            ? `${PlayerType[currentPlayer]} message: ${message} at`
            : `${PlayerType[currentPlayer]} going ${direction} at`;
        console.log('createLog newX: ', newX);
        console.log('createLog newY: ', newY);
        const log = {
            playerType: currentPlayer,
            playerId: playerId,
            direction: direction || null,
            rowY: newY ? newY : null,
            colX: newX ? newX : null,
            message: logMessage,
            gameId,
        };
        console.log('log: ', log);
        return this.gameLogModel.create(log);
    }

    async getGameLogs(gameId: number): Promise<GameLog[]> {
        return this.gameLogModel.findAll({
            where: {
                gameId: gameId,
            },
            order: [['createdAt', 'DESC']],
        });
    }
}
