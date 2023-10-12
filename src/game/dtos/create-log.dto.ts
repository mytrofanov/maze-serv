import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PlayerType } from '../../users/users.model';

export class LogDto {
    @IsNumber()
    readonly gameId: number;
    @IsNumber()
    readonly playerId: number;
    @IsString()
    readonly message: string;
    @IsEnum(PlayerType)
    playerType: PlayerType;
}
