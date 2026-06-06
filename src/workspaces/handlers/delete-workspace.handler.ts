import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { WorkspacesRepository } from '../workspaces.repository';
import { Workspace } from '../workspace.schema';

interface DeleteWorkspaceHandlerInput extends UniqueIdDto {}

type DeleteWorkspaceHandlerOutput = Workspace;

@Injectable()
export class DeleteWorkspaceHandler
  implements
    CommandHandler<DeleteWorkspaceHandlerInput, DeleteWorkspaceHandlerOutput>
{
  constructor(private readonly workspaceRepository: WorkspacesRepository) {}

  public async execute({ id }: DeleteWorkspaceHandlerInput) {
    const workspace = await this.workspaceRepository.delete(id);

    if (!workspace) {
      throw new NotFoundException('Workspace nao encontrado');
    }

    return workspace;
  }
}
