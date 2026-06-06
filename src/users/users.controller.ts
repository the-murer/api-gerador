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
import { Roles } from '@app/auth/roles/decorator';
import { UpdateProfilePictureHandler } from './handlers/update-profile-picture.handler';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { AuthUser } from '@app/utils/user-decorator';
import type { SessionUser } from '@app/auth/session.types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findByIdHandler: FindUserByIdHandler,
    private readonly findHandler: FindUsersHandler,
    private readonly createHandler: CreateUserHandler,
    private readonly updateHandler: UpdateUserHandler,
    private readonly changeActiveHandler: ChangeUserActiveHandler,
    private readonly updateProfilePictureHandler: UpdateProfilePictureHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Roles({ action: 'read', subject: 'User' })
  async findById(@Param() { id }: UniqueIdDto) {
    const result = await this.findByIdHandler.execute({ id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('active')
  @Roles({ action: 'update', subject: 'User' })
  async changeActive(@Body() changeActiveDto: ChangeUserActiveDto) {
    const result = await this.changeActiveHandler.execute(changeActiveDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('profile-picture')
  @Roles({ action: 'update', subject: 'User' })
  async updateProfilePicture(
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    const result = await this.updateProfilePictureHandler.execute(
      updateProfilePictureDto,
    );

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Roles({ action: 'update', subject: 'User' })
  async update(@Param() { id }: UniqueIdDto, @Body() updateDto: CreateUserDto) {
    const result = await this.updateHandler.execute({ id, ...updateDto });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles({ action: 'read', subject: 'User' })
  async find(@Query() findDto: FindUsersDto, @AuthUser() user: SessionUser) {
    const result = await this.findHandler.execute({
      ...findDto,
      workspaceId: user.workspaceId,
    });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @Roles({ action: 'create', subject: 'User' })
  async create(@Body() createDto: CreateUserDto) {
    const result = await this.createHandler.execute(createDto);

    return result;
  }
}
