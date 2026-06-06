import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { WorkspacesRepository } from '../workspaces.repository';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { Workspace } from '../workspace.schema';

interface CreateWorkspaceHandlerInput extends CreateWorkspaceDto {}

type CreateWorkspaceHandlerOutput = Workspace;

@Injectable()
export class CreateWorkspaceHandler
  implements
    CommandHandler<CreateWorkspaceHandlerInput, CreateWorkspaceHandlerOutput>
{
  constructor(
    @Inject(WorkspacesRepository)
    private readonly workspaceRepository: WorkspacesRepository,
  ) {}

  public async execute(input: CreateWorkspaceHandlerInput) {
    const workspace = await this.workspaceRepository.create({
      name: input.name,
      active: true,
    });

    return workspace;
  }
}
