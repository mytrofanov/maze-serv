import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import {GameLog} from "../game-log/game-log.model";
import {Player} from "../players/player.model";
import {Maze} from "../maze/maze.model";
import {Game} from "./game.model";
import {SequelizeModule} from "@nestjs/sequelize";

@Module({
    imports: [SequelizeModule.forFeature([Game, Maze, Player, GameLog])],
    providers: [GameGateway, GameService],
})
export class GameModule {}
