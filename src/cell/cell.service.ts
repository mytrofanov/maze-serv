import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MazeCell, Cell, Direction, Position } from './cell.model';
import { PlayerType } from '../players/player.model';

@Injectable()
export class MazeCellService {
    constructor(
        @InjectModel(MazeCell)
        private readonly mazeCellModel: typeof MazeCell,
    ) {}

    async createCell(data: { gameId: number; position: Position; type: Cell }): Promise<MazeCell> {
        return this.mazeCellModel.create(data);
    }

    async updateCell(cellId: number, changes: Partial<MazeCell>): Promise<MazeCell> {
        const cell = await this.mazeCellModel.findByPk(cellId);

        if (!cell) {
            throw new NotFoundException(`Cell with ID ${cellId} not found`);
        }

        return cell.update(changes);
    }

    async setPlayer(cellId: number, player: PlayerType): Promise<MazeCell> {
        return this.updateCell(cellId, { player });
    }

    async setDirection(cellId: number, direction: Direction): Promise<MazeCell> {
        return this.updateCell(cellId, { direction });
    }

    async revealCell(cellId: number): Promise<MazeCell> {
        return this.updateCell(cellId, { revealed: true });
    }
}
