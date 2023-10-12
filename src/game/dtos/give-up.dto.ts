import { IsNumber } from 'class-validator';

export class GiveUpDto {
    @IsNumber()
    readonly gameId: number;
    @IsNumber()
    readonly playerId: number;
}
