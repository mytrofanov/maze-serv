import { Direction } from '../../cell/cell.model';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class DirectionDto {
    @IsEnum(Direction)
    direction: Direction;
    @IsNumber()
    readonly gameId: number;
    @IsNumber()
    readonly playerId: number;
    @IsString()
    readonly message: string;
}
