import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameLogService } from './game-log.service';
import { GameLog } from './game-log.model';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [SequelizeModule.forFeature([GameLog]), UsersModule],
    providers: [GameLogService],
    exports: [GameLogService],
})
export class GameLogModule {}
