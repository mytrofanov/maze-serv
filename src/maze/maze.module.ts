import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCellModule, MazeCellService } from '../cell';
import { Maze } from './maze.model';
import { MazeService } from './maze.service';
import { GameModule, GameService } from '../game';
import { RowService } from '../row';
import { RowModule } from '../row/row.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Maze]),
        forwardRef(() => GameModule),
        forwardRef(() => MazeCellModule),
        forwardRef(() => RowModule),
    ],
    providers: [MazeService, GameService, RowService, MazeCellService],
    exports: [MazeService],
})
export class MazeModule {}
