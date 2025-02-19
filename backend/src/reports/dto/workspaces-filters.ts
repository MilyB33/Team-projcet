import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { DefaultFiltersDto } from './default-filters.dto';

export class WorkspacesFiltersDto extends DefaultFiltersDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((val) => parseInt(val, 10));
    }
  })
  @IsInt({ each: true })
  @ApiProperty({ nullable: true, required: false, isArray: true })
  @IsOptional()
  workspaceId?: number[];
}
