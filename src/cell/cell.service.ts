import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MazeCell } from './cell.model';

@Injectable()
export class MazeCellService {
    constructor(
        @InjectModel(MazeCell)
        private readonly mazeCellModel: typeof MazeCell,
    ) {}

    async createCell(values: Partial<MazeCell>): Promise<MazeCell> {
        return await this.mazeCellModel.create(values);
    }

    async findCell(values: Partial<MazeCell>): Promise<MazeCell> {
        return await this.mazeCellModel.findOne({
            where: values,
        });
    }

    async updateCell(cellId: number, changes: Partial<MazeCell>): Promise<MazeCell> {
        const cell = await this.mazeCellModel.findByPk(cellId);
        if (!cell) {
            throw new NotFoundException(`Cell with ID ${cellId} not found`);
        }

        return cell.update(changes);
    }

    async findCellByXAndRowId(x: number, rowId: number): Promise<MazeCell | null> {
        const cell = await this.mazeCellModel.findOne({
            where: {
                colX: x,
                rowId: rowId,
            },
        });

        if (!cell) {
            throw new NotFoundException(`No cell found with X:${x} for RowId:${rowId}.`);
        }

        return cell;
    }
}
