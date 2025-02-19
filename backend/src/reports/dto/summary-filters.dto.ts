import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class SummaryFiltersDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  projectId?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  workspaceId?: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  endDate: Date;
}
