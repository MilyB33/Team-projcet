import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
