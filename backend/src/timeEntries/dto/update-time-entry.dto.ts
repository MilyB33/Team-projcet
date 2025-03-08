import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTimeEntryDto } from './create-time-entry.dto';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTimeEntryDto extends PartialType(CreateTimeEntryDto) {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty()
  endTime: Date;
}
