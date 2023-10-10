import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cell, Direction, MazeCell, Position } from './cell.model';
import { Mazes } from '../lib/mazes';
import { GameService } from '../game/game.service';
import { PlayerType } from '../users/users.model';
import { flattenMaze, MazeArrCell, unflattenMaze } from '../utils';

@Injectable()
export class MazeCellService {
    constructor(
        @InjectModel(MazeCell)
        private readonly mazeCellModel: typeof MazeCell,
        @Inject(forwardRef(() => GameService))
        private readonly gameService: GameService,
    ) {}

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

    async createRandomMaze(gameId: number): Promise<any> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];

        if (!randomMazeData) {
            throw new NotFoundException('Maze not found');
        }

        const cellsData = flattenMaze(randomMazeData, gameId);

        await this.mazeCellModel.bulkCreate(cellsData);
        return randomMazeData;
    }

    async getMazeById(gameId: number): Promise<MazeArrCell[][]> {
        const cells = await this.mazeCellModel.findAll({
            where: { gameId: gameId },
            order: [['rowY', 'ASC']],
        });

        if (!cells.length) {
            throw new NotFoundException('No cells found for the provided gameId.');
        }

        return unflattenMaze(cells);
    }

    async findPlayerPosition(gameId: number, player: PlayerType): Promise<Position | null> {
        const cell = await this.mazeCellModel.findOne({
            where: {
                gameId: gameId,
                player: player,
            },
        });

        if (!cell) {
            throw new NotFoundException(`Cell with player ${player} not found in the game with ID ${gameId}`);
        }
        const position = { x: cell.colX, y: cell.rowY };
        return position;
    }
    async handleDirectionChange(
        gameId: number,
        direction: Direction,
        startPosition: Position,
        updatedPosition: Position,
        currentPlayer: PlayerType,
    ) {
        const prevCell = await this.mazeCellModel.findOne({
            where: {
                position: startPosition,
                gameId: gameId,
            },
        });
        const newCell = await this.mazeCellModel.findOne({
            where: {
                position: updatedPosition,
                gameId: gameId,
            },
        });

        if (!newCell || !prevCell) {
            throw new NotFoundException(
                `Cell with position ${updatedPosition} or ${startPosition} not found in the game with ID ${gameId}`,
            );
        }

        if (newCell.type !== Cell.WALL) {
            if (newCell.type === Cell.EXIT) {
                await this.gameService.setWinner(
                    gameId,
                    currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER1 : PlayerType.PLAYER2,
                );
            }
            //move player to new cell
            await this.updateCell(newCell.id, {
                revealed: true,
                player: currentPlayer,
            });
            //clear prev cell
            await this.updateCell(prevCell.id, {
                revealed: true,
                player: undefined,
                direction: direction,
            });
        }
        //if wall
        await this.updateCell(newCell.id, {
            revealed: true,
        });
    }
}
