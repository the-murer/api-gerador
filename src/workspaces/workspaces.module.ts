
import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { CreateWorkspaceHandler } from './handlers/create-workspace.handler';
import { WorkspacesRepository } from './workspaces.repository';
import { FindWorkspaceByIdHandler } from './handlers/find-workspace-by-id.handler';
import { FindWorkspacesHandler } from './handlers/find-workspaces.handler';
import { UpdateWorkspaceHandler } from './handlers/update-workspace.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema }]),
  ],
  controllers: [WorkspacesController],
  providers: [
    WorkspacesRepository,
    CreateWorkspaceHandler,
    FindWorkspaceByIdHandler,
    FindWorkspacesHandler,
    UpdateWorkspaceHandler,
    FindWorkspacesHandler,
  ],
  exports: [WorkspacesRepository],
})
export class WorkspacesModule {}

  