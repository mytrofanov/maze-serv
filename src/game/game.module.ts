import { forwardRef, Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLog, GameLogModule } from '../game-log';
import { Game } from './game.model';
import { SequelizeModule } from '@nestjs/sequelize';
// import { MazeCellModule } from '../cell';
import { UsersModule } from '../users';
import { RowModule } from '../row/row.module';
import { MazeModule } from '../maze/maze.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Game, GameLog]),
        GameLogModule,
        // forwardRef(() => MazeCellModule),
        RowModule,
        forwardRef(() => MazeModule),
        UsersModule,
    ],
    providers: [GameGateway, GameService],
    exports: [GameService],
})
export class GameModule {}
