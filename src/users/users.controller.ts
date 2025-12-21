import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FindUserByIdHandler } from './handlers/find-user-by-id.handler';
import { CreateUserHandler } from './handlers/create-user.handler';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersHandler } from './handlers/find-users.handler';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserHandler } from './handlers/update-user.handler';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { ChangeUserActiveDto } from './dto/change-user-active.dto';
import { ChangeUserActiveHandler } from './handlers/change-user-active.handler';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findByIdHandler: FindUserByIdHandler,
    private readonly findHandler: FindUsersHandler,
    private readonly createHandler: CreateUserHandler,
    private readonly updateHandler: UpdateUserHandler,
    private readonly changeActiveHandler: ChangeUserActiveHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param() { id }: UniqueIdDto) {
    const result = await this.findByIdHandler.execute({ id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('active')
  async changeActive(@Body() changeActiveDto: ChangeUserActiveDto) {
    const result = await this.changeActiveHandler.execute(changeActiveDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param() { id }: UniqueIdDto, @Body() updateDto: CreateUserDto) {
    const result = await this.updateHandler.execute({ id, ...updateDto });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async find(@Query() findDto: FindUsersDto) {
    const result = await this.findHandler.execute(findDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createDto: CreateUserDto) {
    const result = await this.createHandler.execute(createDto);

    return result;
  }
}
