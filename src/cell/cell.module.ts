import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCell } from './cell.model';
import { MazeCellService } from './cell.service';
import { GameModule } from '../game/game.module';

@Module({
    imports: [SequelizeModule.forFeature([MazeCell]), forwardRef(() => GameModule)],
    providers: [MazeCellService],
    exports: [MazeCellService],
})
export class MazeCellModule {}
