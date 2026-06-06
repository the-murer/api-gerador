
import { DefaultPaginationDto } from '@app/app/dtos/default-pagination.dto';
import { Workspace } from '../workspace.schema';

export class FindWorkspacesDto extends DefaultPaginationDto<Workspace> {}

  