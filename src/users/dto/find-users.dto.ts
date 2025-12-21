import { DefaultPaginationDto } from '@app/app/dtos/default-pagination.dto';
import { User } from '../users.schema';

export class FindUsersDto extends DefaultPaginationDto<User> {}
