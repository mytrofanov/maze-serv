import { IsNumber } from 'class-validator';

export class ConnectToGamePayloadDto {
    @IsNumber()
    readonly gameId: number;
    @IsNumber()
    readonly userId: number;
}
