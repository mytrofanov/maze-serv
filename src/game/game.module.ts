import { forwardRef, Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameLog } from '../game-log/game-log.model';
import { Game } from './game.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogModule } from '../game-log/game-log.module';
import { MazeCellModule } from '../cell/cell.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Game, GameLog]),
        GameLogModule,
        forwardRef(() => MazeCellModule),
        UsersModule,
    ],
    providers: [GameGateway, GameService],
    exports: [GameService],
})
export class GameModule {}
