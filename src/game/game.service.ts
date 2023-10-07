import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './game.model';
import { Maze } from '../maze/maze.model';
import {Mazes} from "../lib/mazes";

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game)
        private readonly gameModel: typeof Game,
        @InjectModel(Maze)
        private readonly mazeModel: typeof Maze,
    ) {}

    async createGame(payload: any): Promise<Game> {
        const {player1Id} = payload;
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];
        if (!randomMazeData) {
            throw new NotFoundException('Maze not found');
        }

        const newMazeInstance = new Maze();
        newMazeInstance.maze = randomMazeData;
        const randomMaze = await newMazeInstance.save();


        const newGame = await this.gameModel.create({
            mazeId: randomMaze.id,
            player1Id,
            status: 'waiting_for_player',
        });

        return newGame;
    }

    async getAvailableGames(): Promise<Game[]> {
        return this.gameModel.findAll({
            where: {
                player2Id: null,
                status: 'waiting_for_player',
            },
        });
    }

}