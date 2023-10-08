import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogService } from './game-log.service';
import { GameLog } from './game-log.model';

@Module({
    imports: [
        SequelizeModule.forFeature([GameLog]),
    ],
    providers: [GameLogService],
    exports: [GameLogService]
})
export class GameLogModule {}
