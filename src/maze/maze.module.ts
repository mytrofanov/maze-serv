import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCellModule, MazeCellService } from '../cell';
import { Maze } from './maze.model';
import { MazeService } from './maze.service';
import { GameService } from '../game';
import { RowService } from '../row';
import { RowModule } from '../row/row.module';

@Module({
    imports: [SequelizeModule.forFeature([Maze]), forwardRef(() => MazeCellModule), RowModule, GameModule],
    providers: [MazeService, GameService, RowService, MazeCellService],
    exports: [MazeService],
})
export class GameModule {}
