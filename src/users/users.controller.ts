import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {

  constructor(private  usersService: UsersService) {
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  getAll(){
    return this.usersService.getAllUsers();
  }

  @Get('/:userName')
  getUserByName(@Param('userName') userName: string){
    return this.usersService.getUserByName(userName);
  }

  @Get('/:id')
  getUserById(@Param('value') id: string){
    return this.usersService.getUserById(id);
  }

}
