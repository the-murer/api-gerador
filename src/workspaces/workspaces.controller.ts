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
import { FindWorkspaceByIdHandler } from './handlers/find-workspace-by-id.handler';
import { CreateWorkspaceHandler } from './handlers/create-workspace.handler';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { FindWorkspacesHandler } from './handlers/find-workspaces.handler';
import { FindWorkspacesDto } from './dto/find-workspaces.dto';
import { UpdateWorkspaceHandler } from './handlers/update-workspace.handler';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { Roles } from '@app/auth/roles/decorator';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly findByIdHandler: FindWorkspaceByIdHandler,
    private readonly findHandler: FindWorkspacesHandler,
    private readonly createHandler: CreateWorkspaceHandler,
    private readonly updateHandler: UpdateWorkspaceHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Roles({ action: 'read', subject: 'Workspace' })
  async findById(@Param() { id }: UniqueIdDto) {
    const result = await this.findByIdHandler.execute({ id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Roles({ action: 'update', subject: 'Workspace' })
  async update(
    @Param() { id }: UniqueIdDto,
    @Body() updateDto: CreateWorkspaceDto,
  ) {
    const result = await this.updateHandler.execute({ id, ...updateDto });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles({ action: 'read', subject: 'Workspace' })
  async find(@Query() findDto: FindWorkspacesDto) {
    const result = await this.findHandler.execute(findDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @Roles({ action: 'create', subject: 'Workspace' })
  async create(@Body() createDto: CreateWorkspaceDto) {
    const result = await this.createHandler.execute(createDto);

    return result;
  }
}
