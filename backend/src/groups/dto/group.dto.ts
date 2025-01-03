import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupDto {
  @IsString()
  @ApiProperty()
  name: string;
}
