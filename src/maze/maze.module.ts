import { Module } from '@nestjs/common';
import { MazeService } from './maze.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Maze } from './maze.model';

@Module({
    imports: [SequelizeModule.forFeature([Maze])],
    providers: [MazeService],
    exports: [MazeService],
})
export class MazeModule {}
