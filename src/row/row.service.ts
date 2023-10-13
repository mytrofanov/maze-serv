import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Row } from './row.model';
import { MazeCell } from '../cell';
import { PlayerType } from '../users';
import { Maze } from '../maze';

@Injectable()
export class RowService {
    constructor(
        @InjectModel(Row)
        private readonly rowModel: typeof Row,
        @InjectModel(MazeCell) private readonly mazeCellModel: typeof MazeCell,
    ) {}

    async findRowWithPlayer(gameId: number, player: PlayerType): Promise<Row | null> {
        return await this.rowModel.findOne({
            where: {},
            include: [
                {
                    model: Maze,
                    as: 'maze',
                    where: { gameId: gameId },
                },
                {
                    model: this.mazeCellModel,
                    as: 'cells',
                    where: { player: player },
                },
            ],
        });
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
