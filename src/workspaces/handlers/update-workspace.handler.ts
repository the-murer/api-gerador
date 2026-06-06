import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { WorkspacesRepository } from '../workspaces.repository';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { Workspace } from '../workspace.schema';

interface UpdateWorkspaceHandlerInput extends Partial<CreateWorkspaceDto> {
  id: string;
}

type UpdateWorkspaceHandlerOutput = Workspace;

@Injectable()
export class UpdateWorkspaceHandler
  implements
    CommandHandler<UpdateWorkspaceHandlerInput, UpdateWorkspaceHandlerOutput>
{
  constructor(
    @Inject(WorkspacesRepository)
    private readonly workspacesRepository: WorkspacesRepository,
  ) {}

  public async execute({ id, ...input }: UpdateWorkspaceHandlerInput) {
    const workspace = await this.workspacesRepository.updateById(id, input);

    if (!workspace) {
      throw new NotFoundException('Workspace nao encontrado');
    }

    return workspace;
  }
}
