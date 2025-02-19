import { Optional } from '@nestjs/common';
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
  @ApiProperty()
  @Optional()
  endTime: Date | null;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  projectUserId: number;
}
