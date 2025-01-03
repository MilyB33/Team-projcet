import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  user: number;

  @IsInt()
  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  groups: number[];
}
