import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) {
    }

    async createUser (dto: CreateUserDto) {
      const user = await this.userRepository.create(dto);
      return user;
    }

    async getAllUsers () {
      return await this.userRepository.findAll({include: { all: true }});
    }

    async getUserByName (userName: string) {
      return await this.userRepository.findOne({where: {userName}, include: {all: true}});
    }

    async getUserById (id: string) {
      return await this.userRepository.findOne({where: {id}, include: {all: true}});
    }

    async isUserNameTaken(userName: string): Promise<boolean> {
        const user = await this.getUserByName(userName);
        return !!user;
    }
    async createUserIfNotExists(userDto: CreateUserDto): Promise<User | null> {
        if (await this.isUserNameTaken(userDto.userName)) {
            return null
        }

        return this.createUser(userDto);
    }
}
