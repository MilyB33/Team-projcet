import { IsArray, ValidateNested } from 'class-validator';
import { GroupDto } from '../../groups/dto/group.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddGroupsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupDto)
  @ApiProperty()
  groups: GroupDto[];
}
