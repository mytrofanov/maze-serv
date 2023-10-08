import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './game.model';
import { MazeService } from '../maze/maze.service';
import { PlayerType } from '../players/player.model';
import { MazeCell } from '../lib/mazes';
import { Maze } from '../maze/maze.model';
import { findPlayerPosition } from '../utils';
import { Position } from '../game-log/game-log.model';

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

    async findGame(gameId: number): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);

        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        return game;
    }

    async togglePlayer(gameId: number): Promise<Game> {
        const game = await this.findGame(gameId);

        game.currentPlayer = game.currentPlayer === PlayerType.PLAYER1 ? PlayerType.PLAYER2 : PlayerType.PLAYER1;
        await game.save();
        return game;
    }

    async findPlayerPosition(gameId: number): Promise<{ playerPosition: Position; currentPlayer: PlayerType } | null> {
        const game = await this.gameModel.findByPk(gameId, { include: [Maze] });
        if (!game || !game.maze) {
            throw new NotFoundException(`Game with ID ${gameId} or its maze not found`);
        }
        const currentPlayer = game.currentPlayer;
        const playerPosition = findPlayerPosition(game.maze.maze, currentPlayer);
        return { playerPosition, currentPlayer };
    }

    async setWinner(gameId: number, winner: PlayerType): Promise<Game> {
        const game = await this.gameModel.findByPk(gameId);
        if (!game) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }

        game.winner = winner;
        await game.save();

        return game;
    }
}
