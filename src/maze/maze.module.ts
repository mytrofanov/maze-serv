import { Module } from '@nestjs/common';
import { MazeService } from './maze.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Maze } from './maze.model';
import {PlayerModule} from "../players/player.module";
import {GameModule} from "../game/game.module";

@Module({
    imports: [SequelizeModule.forFeature([Maze]), PlayerModule, GameModule],
    providers: [MazeService],
    exports: [MazeService],
})
export class MazeModule {}
