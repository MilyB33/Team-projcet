import { PickType } from '@nestjs/swagger';
import { CreateTimeEntryDto } from './create-time-entry.dto';

export class EndTimeEntryDto extends PickType(CreateTimeEntryDto, [
  'endTime',
]) {}
