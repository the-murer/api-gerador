import { IsNumber } from 'class-validator';

export class DefaultPaginationDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}

export type Metadata = {
  total: number;
};

export type DefaultPaginationResponse<T> = {
  metadata: Metadata;
  items: T[];
};
