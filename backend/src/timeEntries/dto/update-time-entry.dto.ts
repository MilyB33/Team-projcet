import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTimeEntryDto } from './create-time-entry.dto';
import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateTimeEntryDto extends PartialType(CreateTimeEntryDto) {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;
}
