import { IsString } from "class-validator";

export class CreateUserDto {
  @IsString({message: 'must be a string'})
  readonly userName: string;
}
