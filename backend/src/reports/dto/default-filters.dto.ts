import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class DefaultFiltersDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  endDate: Date;
}
