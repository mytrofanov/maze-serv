import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import {GameLog} from "../game-log/game-log.model";
import {Player} from "../players/player.model";
import {Maze} from "../maze/maze.model";
import {Game} from "./game.model";
import {SequelizeModule} from "@nestjs/sequelize";
import { MazeModule } from '../maze/maze.module';
import {GameLogModule} from "../game-log/game-log.module";
import {PlayerModule} from "../players/player.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Game, Maze, Player, GameLog]),
        MazeModule, GameLogModule, PlayerModule
    ],
    providers: [GameGateway, GameService],
})
export class GameModule {}
