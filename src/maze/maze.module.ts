import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCellModule } from '../cell/cell.module';
import { Maze } from './maze.model';
import { MazeService } from './maze.service';
import { GameModule } from '../game';
import { RowModule } from '../row/row.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Maze]),
        forwardRef(() => GameModule),
        forwardRef(() => MazeCellModule),
        forwardRef(() => RowModule),
    ],
    providers: [MazeService],
    exports: [MazeService],
})
export class MazeModule {}
