import { IsNumber } from 'class-validator';

export class CreateGameDto {
    @IsNumber()
    readonly player1Id: number;
}
