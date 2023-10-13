import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cell, Direction, MazeCell, Position } from './cell.model';
import { Mazes } from '../lib/mazes';
import { GameService } from '../game';
import { PlayerType } from '../users/users.model';
import { flattenMaze, MazeArrCell, unflattenMaze } from '../utils';
import { Row } from '../row';
import { Maze } from '../maze';

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

    async createRandomMaze(gameId: number): Promise<any> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];

        if (!randomMazeData) {
            throw new NotFoundException('Maze not found');
        }

        const cellsData = flattenMaze(randomMazeData, gameId);

        await this.mazeCellModel.bulkCreate(cellsData);
        return this.getMazeById(gameId);
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

    // async findPlayerPosition(gameId: number, player: PlayerType): Promise<MazeCell | null> {
    //     const cell = await this.mazeCellModel.findOne({
    //         include: {
    //             model: Row,
    //             where: {
    //                 gameId: gameId,
    //                 player: player,
    //             },
    //         },
    //         where: {
    //             gameId: gameId,
    //             player: player,
    //         },
    //     });
    //
    //     if (!cell) {
    //         throw new NotFoundException(`Cell with player ${player} not found in the game with ID ${gameId}`);
    //     }
    //     return cell;
    // }

    async handleDirectionChange(
        gameId: number,
        mazeId: number,
        direction: Direction,
        startPosition: MazeCell,
        updatedPosition: Position,
        currentPlayer: PlayerType,
    ) {
        const prevCell = await this.mazeCellModel.findByPk(startPosition.id);
        // const newCell = await this.mazeCellModel.findOne({
        //     where: {
        //         gameId: gameId,
        //         colX: updatedPosition.x,
        //         rowY: updatedPosition.y,
        //     },
        // });

        const newCell = await this.mazeCellModel.findOne({
            include: {
                model: Row,
                where: { rowY: updatedPosition.y },
                include: [
                    {
                        model: Maze,
                        where: { id: mazeId },
                    },
                ],
            },
            where: { colX: updatedPosition.x },
        });
        console.log('found newCell:', newCell);
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
            newCell.revealed = true;
            newCell.player = currentPlayer;
            await newCell.save();
            console.log('newCell: ', newCell);

            //clear prev cell
            prevCell.revealed = true;
            prevCell.player = null;
            prevCell.direction = direction;
            await prevCell.save();
        }
        //if wall
        newCell.revealed = true;
        await newCell.save();
    }
}
