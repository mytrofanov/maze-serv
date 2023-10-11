import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameLog } from './game-log.model';
import { Direction } from '../cell/cell.model';
import { PlayerType } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { checkForNullUndefined } from '../utils';

@Injectable()
export class GameLogService {
    constructor(
        @InjectModel(GameLog)
        private readonly gameLogModel: typeof GameLog,
        private readonly usersService: UsersService,
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
        const user = await this.usersService.getUserById(playerId);
        const logMessage = checkForNullUndefined(message)
            ? `${user.userName} sending message: ${message}`
            : `${user.userName} going ${direction}`;
        const log = {
            playerType: currentPlayer,
            playerId: playerId,
            direction: direction || null,
            rowY: newY ? newY : null,
            colX: newX ? newX : null,
            message: logMessage,
            gameId,
        };

        return this.gameLogModel.create(log);
    }

    async getGameLogs(gameId: number): Promise<GameLog[]> {
        return this.gameLogModel.findAll({
            where: {
                gameId: gameId,
            },
            order: [['id', 'DESC']],
        });
    }
}
