import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cell, Direction, MazeCell, Position } from '../cell/cell.model';
import { MazeCellService } from '../cell/cell.service';
import { Mazes } from '../lib/mazes';
import { Game, GameService } from '../game';
import { PlayerType } from '../users';
import { Row, RowService } from '../row';
import { Maze } from './maze.model';
import { checkCellsForPlayer } from '../utils/check-cells-for-player';

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
                        },
                    ],
                },
            ],
            order: [
                [{ model: Row, as: 'rows' }, 'id', 'ASC'],
                [{ model: Row, as: 'rows' }, { model: MazeCell, as: 'cells' }, 'id', 'ASC'],
            ],
        });

        if (!maze) {
            throw new NotFoundException('No maze found for the provided gameId.');
        }

        return maze;
    }

    async createRandomMaze(gameId: number): Promise<Maze> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];
        const createdMaze = await this.mazeModel.create({ gameId });

        // Iterate through the randomMazeData to create Rows and MazeCells.
        for (let y = 0; y < randomMazeData.length; y++) {
            const row = randomMazeData[y];

            // Create a Row instance and associate it with the Maze.
            const createdRow = await this.rowService.createRow({
                rowY: y,
                mazeId: createdMaze.id,
                player1onRow: checkCellsForPlayer(row, PlayerType.PLAYER1),
                player2onRow: checkCellsForPlayer(row, PlayerType.PLAYER2),
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

    async findPlayerPosition(game: Game, player: PlayerType): Promise<{ y: Row; x: MazeCell } | null> {
        // const game = await this.gameService.findGame(gameId);
        // if (!game) {
        //     throw new NotFoundException(`No game found with id:${gameId} `);
        // }
        // Find the Row containing the player using RowService.
        console.log('game.mazeId: ', game.mazeId, ', player: ', player);
        // console.log('game.maze: ', game.maze);
        const foundRow = await this.rowService.findRowWithPlayer(game.mazeId, player);
        console.log('foundRow: ', foundRow);
        const foundCell = await this.cellService.findCell({
            player: player,
            rowId: foundRow.id,
        });

        return { y: foundRow, x: foundCell };
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
        console.log('updatedPosition: ', updatedPosition);
        const newRow = await this.rowService.findRowByYAndMazeId(updatedPosition.y, mazeId);
        const newCell = await this.cellService.findCellByXAndRowId(updatedPosition.x, newRow.id);
        const isPlayer1 = currentPlayer === PlayerType.PLAYER1;
        const isPlayer2 = currentPlayer === PlayerType.PLAYER2;

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
            await this.rowService.updateRow(newRow.id, {
                player1onRow: isPlayer1,
            });
            if (isPlayer1) {
                await this.rowService.updateRow(newRow.id, {
                    player1onRow: isPlayer1,
                });
            }
            if (isPlayer2) {
                await this.rowService.updateRow(newRow.id, {
                    player2onRow: isPlayer2,
                });
            }

            //move player to new cell
            await this.cellService.updateCell(newCell.id, { revealed: true, player: currentPlayer });

            //clear prev row
            if (isPlayer1 && newRow.id !== prevRow.id) {
                await this.rowService.updateRow(prevRow.id, {
                    player1onRow: !isPlayer1,
                });
            }
            if (isPlayer2 && newRow.id !== prevRow.id) {
                await this.rowService.updateRow(prevRow.id, {
                    player2onRow: !isPlayer2,
                });
            }

            //clear prev cell
            await this.cellService.updateCell(prevCell.id, { revealed: true, player: null, direction: direction });
        }
        //if wall
        // newCell.revealed = true;
        await this.cellService.updateCell(newCell.id, { revealed: true });
        // await newCell.save();
    }
}
