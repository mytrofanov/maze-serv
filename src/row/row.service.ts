import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Row } from './row.model';
import { PlayerType } from '../users/users.model';

@Injectable()
export class RowService {
    constructor(
        @InjectModel(Row)
        private readonly rowModel: typeof Row,
    ) {}

    async findRowWithPlayer(mazeId: number, player: PlayerType): Promise<Row | null> {
        const player1 = player === PlayerType.PLAYER1;
        const player2 = player === PlayerType.PLAYER2;
        if (player1) {
            return await this.rowModel.findOne({
                where: {
                    mazeId: mazeId,
                    player1onRow: player1,
                },
            });
        }
        if (player2) {
            return await this.rowModel.findOne({
                where: {
                    mazeId: mazeId,
                    player2onRow: player2,
                },
            });
        }
    }

    async findRowByYAndMazeId(y: number, mazeId: number): Promise<Row | null> {
        const row = await this.rowModel.findOne({
            where: {
                rowY: y,
                mazeId: mazeId,
            },
        });

        if (!row) {
            throw new NotFoundException(`No row found with Y:${y} for MazeId:${mazeId}.`);
        }

        return row;
    }

    async createRow(values: Partial<Row>): Promise<Row | null> {
        return await this.rowModel.create(values);
    }

    async updateRow(rowId: number, changes: Partial<Row>): Promise<Row> {
        const row = await this.rowModel.findByPk(rowId);
        if (!row) {
            throw new NotFoundException(`Row with ID ${rowId} not found`);
        }

        return row.update(changes);
    }
}
