import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './game.model';
import { MazeService } from '../maze/maze.service';

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
}

