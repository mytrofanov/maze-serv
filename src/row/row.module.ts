import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Row } from './row.model';
import { RowService } from './row.service';
import { MazeCellModule } from '../cell/cell.module';

@Module({
    imports: [SequelizeModule.forFeature([Row]), forwardRef(() => MazeCellModule)],
    providers: [RowService],
    exports: [RowService],
})
export class RowModule {}
