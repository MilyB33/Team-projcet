import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GroupDto } from '../../groups/dto/group.dto';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  workspaceId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupDto)
  @IsOptional()
  @ApiProperty()
  groups: GroupDto[];
}
