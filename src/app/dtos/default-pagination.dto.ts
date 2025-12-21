import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class DefaultPaginationDto<T> {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
  
  @IsOptional()
  @IsString()
  sort?: keyof T;

  @IsOptional()
  @IsString()
  sortOrder?: SortOrder;
}

export type Metadata = {
  total: number;
};

export type DefaultPaginationResponse<T> = {
  metadata: Metadata;
  items: T[];
};
