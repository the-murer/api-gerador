import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { WorkspacesRepository } from '../workspaces.repository';
import { Workspace } from '../workspace.schema';
import { FindWorkspacesDto } from '../dto/find-workspaces.dto';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';

interface FindWorkspacesHandlerInput extends FindWorkspacesDto {}

type FindWorkspacesHandlerOutput = DefaultPaginationResponse<Workspace>;

@Injectable()
export class FindWorkspacesHandler
  implements
    CommandHandler<FindWorkspacesHandlerInput, FindWorkspacesHandlerOutput>
{
  constructor(
    @Inject(WorkspacesRepository)
    private readonly workspaceRepository: WorkspacesRepository,
  ) {}

  public async execute({
    page,
    limit,
    sort = 'createdAt',
    sortOrder,
  }: FindWorkspacesHandlerInput) {
    const { items, metadata } = await this.workspaceRepository.findPaginated(
      page,
      limit,
      sort as keyof Workspace,
      sortOrder,
    );

    return {
      metadata,
      items,
    };
  }
}
