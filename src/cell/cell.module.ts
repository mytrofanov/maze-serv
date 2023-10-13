import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MazeCell } from './cell.model';
import { MazeCellService } from './cell.service';
import { Row } from '../row';
import { RowModule } from '../row/row.module';

@Module({
    imports: [SequelizeModule.forFeature([MazeCell, Row]), forwardRef(() => RowModule)],
    providers: [MazeCellService],
    exports: [MazeCellService],
})
export class MazeCellModule {}
