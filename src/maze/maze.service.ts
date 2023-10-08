import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Maze } from './maze.model';
import { Mazes } from "../lib/mazes";

@Injectable()
export class MazeService {
    constructor(
        @InjectModel(Maze)
        private readonly mazeModel: typeof Maze,
    ) {}

    async createRandomMaze(): Promise<Maze> {
        const randomMazeData = Mazes[Math.floor(Math.random() * Mazes.length)];
        if (!randomMazeData) {
            throw new NotFoundException('Maze not found');
        }

        const newMazeInstance = new Maze();
        newMazeInstance.maze = randomMazeData;
        return newMazeInstance.save();
    }
}
