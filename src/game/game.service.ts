import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Game} from './game.model';
import { MazeService } from '../maze/maze.service';
import {PlayerType} from "../players/player.model";

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

        game.currentPlayer = game.currentPlayer === PlayerType.PLAYER1
            ? PlayerType.PLAYER2
            : PlayerType.PLAYER1;

        await game.save();

        return game;
    }
}

