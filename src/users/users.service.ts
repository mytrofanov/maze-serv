import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CheckUserDto, CreateUserDto } from './dto/create-user.dto';
import { checkForNullUndefined } from '../utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async createUser(dto: CreateUserDto) {
        console.log('createUser dto: ', dto);
        const user = await this.userModel.create({ userName: dto.userName });
        return user;
    }

    async getAllUsers() {
        return await this.userModel.findAll({ include: { all: true } });
    }

    async updateUser(userId: number, changes: Partial<User>) {
        const user = await this.getUserById(userId);
        return user.update(changes);
    }

    async getUserByName(userName: string) {
        return await this.userModel.findOne({ where: { userName }, include: { all: true } });
    }

    async getUserById(id: number) {
        return await this.userModel.findOne({ where: { id }, include: { all: true } });
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
