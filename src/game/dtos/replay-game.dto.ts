import { IsNumber } from 'class-validator';

export class ReplayGamePayDto {
    @IsNumber()
    readonly gameId: number;
}
