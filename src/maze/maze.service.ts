import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Maze } from './maze.model';
import { Direction, MazeCell, Mazes, PlayerType } from '../lib/mazes';
import { Position } from '../game-log/game-log.model';
import { updateMazeCell } from '../utils';

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

    async getMazeById(mazeId: number): Promise<Maze> {
        const maze = await this.mazeModel.findByPk(mazeId);
        if (!maze) {
            throw new NotFoundException(`Maze with ID ${mazeId} not found`);
        }
        return maze;
    }

    async updateMaze(
        mazeId: number,
        currentPosition: Position,
        revealed: boolean,
        prevPosition?: Position,
        direction?: Direction,
        player?: PlayerType,
    ): Promise<Maze> {
        const mazeInstance = await this.getMazeById(mazeId);
        const currentMazeData: MazeCell[][] = mazeInstance.maze;

        const updatedMazeData = updateMazeCell(
            currentMazeData,
            currentPosition,
            revealed,
            prevPosition,
            direction,
            player,
        );

        mazeInstance.maze = updatedMazeData;
        await mazeInstance.save();

        return mazeInstance;
    }
}
