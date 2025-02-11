import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinProjectDto {
  @IsString()
  @ApiProperty()
  accessCode: string;
}
