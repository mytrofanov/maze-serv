import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCellModule, MazeCellService } from '../cell';
import { Maze } from './maze.model';
import { MazeService } from './maze.service';
import { GameModule, GameService } from '../game';
import { RowService } from '../row';
import { RowModule } from '../row/row.module';

@Module({
    imports: [SequelizeModule.forFeature([Maze]), MazeCellModule, RowModule, GameModule],
    providers: [MazeService, GameService, RowService, MazeCellService],
    exports: [MazeService],
})
export class MazeModule {}
