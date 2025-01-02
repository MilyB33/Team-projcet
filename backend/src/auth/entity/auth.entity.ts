import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class AuthEntity {
  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;
}
