import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CheckUserDto, CreateUserDto } from './dto/create-user.dto';
import { checkForNullUndefined } from '../utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userRepository: typeof User,
    ) {}

    async createUser(dto: CreateUserDto) {
        console.log('createUser dto: ', dto);
        const user = await this.userRepository.create({ userName: dto.userName });
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({ include: { all: true } });
    }

    async getUserByName(userName: string) {
        return await this.userRepository.findOne({ where: { userName }, include: { all: true } });
    }

    async getUserById(id: number) {
        return await this.userRepository.findOne({ where: { id }, include: { all: true } });
    }

    async isUserNameTaken(userName: string): Promise<boolean> {
        const user = await this.getUserByName(userName);
        return !!user;
    }
    async createUserIfNotExists(userDto: CheckUserDto): Promise<User | null> {
        const userId = checkForNullUndefined(userDto.userId);
        if (userId) {
            console.log('userDto.userId: ', userDto.userId);
            return this.getUserById(userDto.userId);
        }

        if (!userId) {
            const nameIsTaken = await this.isUserNameTaken(userDto.userName);
            if (nameIsTaken) {
                console.log('isUserNameTaken', nameIsTaken);
                return null;
            } else {
                return this.createUser(userDto);
            }
        }
    }
}
