import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'must be a string' })
    readonly userName: string;
}

export class CheckUserDto {
    @IsString({ message: 'must be a string' })
    readonly userName: string;
    readonly userId?: number;
}
