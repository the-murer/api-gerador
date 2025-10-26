import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { FindUserByIdHandler } from './handlers/find-user-by-id.handler';
import { CreateUserHandler } from './handlers/create-user.handler';
import { Public } from '@app/utils/public.decorator';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findUserByIdHandler: FindUserByIdHandler,
    private readonly createUserHandler: CreateUserHandler
  ) { }


  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Public()
  async findUserById(@Param() { id }: FindUserByIdDto) {
    const user = await this.findUserByIdHandler.execute({ id });

    return user
  }


  @HttpCode(HttpStatus.OK)
  @Post()
  async createUser(@Param() createUserDto: CreateUserDto) {
    const user = await this.createUserHandler.execute(createUserDto);

    return user
  }



}
