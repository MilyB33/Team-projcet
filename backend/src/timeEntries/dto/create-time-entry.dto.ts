import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeEntryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  projectId: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;
}
