import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogService } from './game-log.service';
import { GameLog } from './game-log.model';
import {PlayerModule} from "../players/player.module";

@Module({
    imports: [
        SequelizeModule.forFeature([GameLog]),PlayerModule
    ],
    providers: [GameLogService],
    exports: [GameLogService]
})
export class GameLogModule {}
