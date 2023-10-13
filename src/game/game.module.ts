import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLog } from '../game-log/game-log.model';
import { Game } from './game.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogModule } from '../game-log/game-log.module';
import { MazeCellModule } from '../cell';
import { UsersModule } from '../users/users.module';
import { RowModule } from '../row/row.module';
import { MazeModule } from '../maze/maze.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Game, GameLog]),
        GameLogModule,
        MazeCellModule,
        // forwardRef(() => MazeCellModule),
        RowModule,
        MazeModule,
        UsersModule,
    ],
    providers: [GameGateway, GameService],
    exports: [GameService],
})
export class GameModule {}
