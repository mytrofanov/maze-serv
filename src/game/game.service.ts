import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game, GameStatus } from './game.model';
import { PlayerType } from '../players/player.model';
import { MazeCellService } from '../cell/cell.service';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
        private readonly mazeCellService: MazeCellService,
    ) {}

    async createGame(payload: any): Promise<Game> {
        const { player1Id } = payload;

        const newGame = await this.gameModel.create({
            player1Id,
            status: GameStatus.WAITING_FOR_PLAYER,
        });

        await this.mazeCellService.createRandomMaze(newGame.id);

        return newGame;
    }

    async getAvailableGames(): Promise<Game[]> {
        return this.gameModel.findAll({
            where: {
                status: GameStatus.WAITING_FOR_PLAYER,
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
