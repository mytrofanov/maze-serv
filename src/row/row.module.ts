import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Row } from './row.model';
import { GameService } from '../game';
import { RowService } from './row.service';

@Module({
    imports: [SequelizeModule.forFeature([Row])],
    providers: [RowService],
    exports: [GameService],
})
export class RowModule {}
