import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cell, Direction, MazeCell, Position } from '../cell';
import { MazeMatrixCell, Mazes } from '../lib/mazes';
import { GameService } from '../game';
import { PlayerType } from '../users/users.model';
import { flattenMaze } from '../utils';
import { Row } from '../row/row.model';
import { Maze } from './maze.model';

@Injectable()
export class MazeService {
    constructor(
        @InjectModel(MazeCell)
        private readonly mazeCellModel: typeof MazeCell,
        private readonly mazeModel: typeof Maze,
        @InjectModel(Row) private readonly rowModel: typeof Row,
        @Inject(forwardRef(() => GameService))
        private readonly gameService: GameService,
    ) {}

    async getMazeById(gameId: number): Promise<Maze | null> {
        const maze = await this.mazeModel.findOne({
            where: { gameId: gameId },
            include: [
                {
                    model: Row,
                    as: 'rows',
                    include: [
                        {
                            model: MazeCell,
                            as: 'cells',
                            order: [['colX', 'ASC']],
                        },
                    ],
                    order: [['rowY', 'ASC']],
                },
            ],
        });

        if (!maze) {
            throw new NotFoundException('No maze found for the provided gameId.');
        }

        return maze;
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

    async createMazeFromMatrix(matrix: MazeMatrixCell[][], gameId: number): Promise<Maze> {
        const createdMaze = await this.mazeModel.create({ gameId });

        // 2. Iterate through the matrix to create Rows and MazeCells.
        for (let y = 0; y < matrix.length; y++) {
            const row = matrix[y];

            // Create a Row instance and associate it with the Maze.
            const createdRow = await this.rowModel.create({
                rowY: y,
                mazeId: createdMaze.id,
            });

            for (let x = 0; x < row.length; x++) {
                const cellData = row[x];

                // Create a MazeCell instance and associate it with the Row.
                await this.mazeCellModel.create({
                    type: cellData.type,
                    revealed: cellData.revealed,
                    direction: cellData.direction,
                    player: cellData.player,
                    colX: x,
                    rowId: createdRow.id,
                });
            }
        }

        // 3. Return the created Maze with all associated Rows and MazeCells.
        return this.getMazeById(createdMaze.id);
    }

    // async findPlayerPosition(gameId: number, player: PlayerType): Promise<MazeCell | null> {
    //     const cell = await this.mazeCellModel.findOne({
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

    async findPlayerPosition(gameId: number, player: PlayerType): Promise<MazeCell | null> {
        const cell = await this.mazeCellModel.findOne({
            include: {
                model: Row,
                where: {
                    gameId: gameId,
                    player: player,
                },
            },
            where: {
                gameId: gameId,
                player: player,
            },
        });

        if (!cell) {
            throw new NotFoundException(`Cell with player ${player} not found in the game with ID ${gameId}`);
        }
        return cell;
    }
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
