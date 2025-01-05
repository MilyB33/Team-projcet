import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class JoinProjectDto {
  @IsString()
  @ApiProperty()
  accessCode: string;

  @IsInt()
  @ApiProperty()
  user: number;
}
