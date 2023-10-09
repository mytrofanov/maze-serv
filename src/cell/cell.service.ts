import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MazeCell, Cell, Direction, Position } from './cell.model';
import { PlayerType } from '../players/player.model';
import { Mazes } from '../lib/mazes';

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

    async createRandomMaze(gameId: number): Promise<MazeCell[]> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];

        if (!randomMazeData) {
            throw new NotFoundException('Maze not found');
        }

        const cellsData = randomMazeData.flatMap((rowY, indexY) => {
            return rowY.map((colX, indexX) => ({
                position: JSON.stringify({ y: indexY, x: indexX }),
                gameId: gameId,
                ...colX,
            }));
        });

        return this.mazeCellModel.bulkCreate(cellsData);
    }

    async getMazeById(gameId: number): Promise<MazeCell[][]> {
        const cells = await this.mazeCellModel.findAll({
            where: { gameId: gameId },
            order: [['position', 'ASC']],
        });

        if (!cells.length) {
            throw new NotFoundException('No cells found for the provided gameId.');
        }

        const maze: MazeCell[][] = [];
        //find group method to avoid this:
        cells.forEach(cell => {
            const position = cell.position;
            if (!maze[position.y]) {
                maze[position.y] = [];
            }
            maze[position.y][position.x] = cell;
        });

        return maze;
    }
}
