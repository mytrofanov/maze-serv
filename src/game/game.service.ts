import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './game.model';
import { MazeService } from '../maze/maze.service';
import { PlayerType } from '../players/player.model';
import { MazeCell } from '../lib/mazes';
import { Maze } from '../maze/maze.model';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
        private readonly mazeService: MazeService,
    ) {}

    async createGame(payload: any): Promise<Game> {
        const { player1Id } = payload;
        const randomMaze = await this.mazeService.createRandomMaze();

        return this.gameModel.create({
            mazeId: randomMaze.id,
            player1Id,
            status: 'waiting_for_player',
        });
    }

    async getAvailableGames(): Promise<Game[]> {
        return this.gameModel.findAll({
            where: {
                status: 'waiting_for_player',
            },
        });
    }

    async togglePlayer(gameId: number): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        game.currentPlayer = game.currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER2 : PlayerType.PLAYER1;

        await game.save();

        return game;
    }

    async findPlayerPosition(gameId: number): Promise<{ x: number; y: number } | null> {
        const game = await this.gameModel.findByPk(gameId, { include: [Maze] });
        if (!game || !game.maze) {
            throw new NotFoundException(`Game with ID ${gameId} or its maze not found`);
        }

        return this._findPlayerPosition(game.maze.maze, game.currentPlayer);
    }

    private _findPlayerPosition(maze: MazeCell[][], player: PlayerType): { x: number; y: number } | null {
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x].player === player) {
                    return { x, y };
                }
            }
        }
        return null;
    }
}
