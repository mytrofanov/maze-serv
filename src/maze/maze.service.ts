import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cell, Direction, MazeCell, MazeCellService, Position } from '../cell';
import { MazeMatrixCell, Mazes } from '../lib/mazes';
import { GameService } from '../game';
import { PlayerType } from '../users/users.model';
import { Row, RowService } from '../row';
import { Maze } from './maze.model';

@Injectable()
export class MazeService {
    constructor(
        @InjectModel(Maze)
        private readonly mazeModel: typeof Maze,
        @Inject(forwardRef(() => GameService))
        private readonly gameService: GameService,
        @Inject(forwardRef(() => RowService))
        private readonly rowService: RowService,
        @Inject(forwardRef(() => MazeCellService))
        private readonly cellService: MazeCellService,
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

    // async createRandomMaze(gameId: number): Promise<any> {
    //     const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];
    //
    //     if (!randomMazeData) {
    //         throw new NotFoundException('Maze not found');
    //     }
    //
    //     const cellsData = flattenMaze(randomMazeData, gameId);
    //
    //     await this.mazeCellModel.bulkCreate(cellsData);
    //     return this.getMazeById(gameId);
    // }

    async createRandomMaze(gameId: number): Promise<Maze> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];
        const createdMaze = await this.mazeModel.create({ gameId });

        // Iterate through the matrix to create Rows and MazeCells.
        for (let y = 0; y < randomMazeData.length; y++) {
            const row = randomMazeData[y];

            // Create a Row instance and associate it with the Maze.
            const createdRow = await this.rowService.createRow({
                rowY: y,
                mazeId: createdMaze.id,
            });

            for (let x = 0; x < row.length; x++) {
                const cellData = row[x];

                // Create a MazeCell instance and associate it with the Row.
                await this.cellService.createCell({
                    type: cellData.type,
                    revealed: cellData.revealed,
                    direction: cellData.direction,
                    player: cellData.player,
                    colX: x,
                    rowId: createdRow.id,
                });
            }
        }

        // Return the created Maze with all associated Rows and MazeCells.
        return this.getMazeById(createdMaze.id);
    }

    async findPlayerPosition(gameId: number, player: PlayerType): Promise<{ rowY: Row; colX: MazeCell } | null> {
        // Find the Row containing the player using RowService.
        const foundRow = await this.rowService.findRowWithPlayer(gameId, player);

        // If Row is found, find the MazeCell containing the player.
        if (foundRow) {
            const foundCell = await this.cellService.findCell({
                player: player,
                rowId: foundRow.id,
            });

            // If MazeCell is found, return the ids
            if (foundCell) {
                return { rowY: foundRow, colX: foundCell };
            }
        }

        // If nothing is found, return null.
        return null;
    }

    async handleDirectionChange(
        gameId: number,
        mazeId: number,
        direction: Direction,
        prevRow: Row,
        prevCell: MazeCell,
        updatedPosition: Position,
        currentPlayer: PlayerType,
    ) {
        const newRow = await this.rowService.findRowByYAndMazeId(updatedPosition.y, mazeId);
        const newCell = await this.cellService.findCellByXAndRowId(updatedPosition.x, newRow.id);

        if (!newRow || !newCell) {
            throw new NotFoundException(
                `Cell with position ${updatedPosition.x} or row with position ${updatedPosition.y} not found in the game with ID ${gameId}`,
            );
        }

        if (newCell.type !== Cell.WALL) {
            if (newCell.type === Cell.EXIT) {
                await this.gameService.setWinner(
                    gameId,
                    currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER1 : PlayerType.PLAYER2,
                );
            }
            //move player to new row
            newRow.player = currentPlayer;
            await newRow.save();

            //move player to new cell
            newCell.revealed = true;
            newCell.player = currentPlayer;
            await newCell.save();
            console.log('newCell: ', newCell);

            //clear prev row
            prevRow.player = null;
            await prevRow.save();

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
