import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCell } from './cell.model';
import { MazeCellService } from './cell.service';

@Module({
    imports: [SequelizeModule.forFeature([MazeCell])],
    providers: [MazeCellService],
    exports: [MazeCellService],
})
export class MazeCellModule {}
