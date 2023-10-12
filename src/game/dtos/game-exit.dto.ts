import { IsNumber } from 'class-validator';

export class GameExitDto {
    @IsNumber()
    readonly gameId: number;
    @IsNumber()
    readonly playerId: number;
}
