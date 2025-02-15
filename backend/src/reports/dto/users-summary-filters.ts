import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UsersSummaryFiltersDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  userId?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  projectId?: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  endTime: Date;
}
