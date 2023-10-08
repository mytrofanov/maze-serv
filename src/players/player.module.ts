import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Player } from './player.model';
import { User } from '../users/users.model';
import { Game } from '../game/game.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Player, User, Game]),
    ],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
