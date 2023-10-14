import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLog, GameLogModule } from '../game-log';
import { Game } from './game.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users';
import { MazeModule } from '../maze/maze.module';

@Module({
    imports: [SequelizeModule.forFeature([Game, GameLog]), MazeModule, GameLogModule, UsersModule],
    providers: [GameGateway, GameService],
    exports: [GameService],
})
export class GameModule {}
