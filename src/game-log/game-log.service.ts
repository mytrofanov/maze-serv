import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameLog } from './game-log.model';
import { Game } from '../game/game.model';
import { PlayerType } from '../players/player.model';
import { Direction } from '../cell/cell.model';

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
        message?: string,
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
            gameId,
        };

        return this.gameLogModel.create(log);
    }

    async getGameLogs(gameId: number): Promise<GameLog[]> {
        return this.gameLogModel.findAll({
            where: {
                gameId: gameId,
            },
            order: [['created', 'DESC']],
        });
    }
}
