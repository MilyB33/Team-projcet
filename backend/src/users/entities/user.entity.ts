import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { AccountTypeEntity } from './accountType.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty({ nullable: true })
  company: string;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  @Exclude()
  type?: AccountTypeEntity;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;
}
