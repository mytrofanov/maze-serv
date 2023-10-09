import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Maze } from './maze.model';

@Injectable()
export class MazeService {
    constructor(
        @InjectModel(Maze)
        private readonly mazeModel: typeof Maze,
    ) {}
}
