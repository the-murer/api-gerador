import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { WorkspacesRepository } from '../workspaces.repository';
import { Workspace } from '../workspace.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';

interface FindWorkspaceByIdHandlerInput extends UniqueIdDto {}

type FindWorkspaceByIdHandlerOutput = Workspace;

@Injectable()
export class FindWorkspaceByIdHandler
  implements
    CommandHandler<
      FindWorkspaceByIdHandlerInput,
      FindWorkspaceByIdHandlerOutput
    >
{
  constructor(
    @Inject(WorkspacesRepository)
    private readonly workspaceRepository: WorkspacesRepository,
  ) {}

  public async execute({ id }: FindWorkspaceByIdHandlerInput) {
    const workspace = await this.workspaceRepository.findById(id);

    if (!workspace) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return workspace;
  }
}
