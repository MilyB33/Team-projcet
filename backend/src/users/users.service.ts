import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User with that email already exists');
    }

    if (createUserDto.account_type === 'employer' && !createUserDto.company) {
      throw new BadRequestException(
        'company field is required when creating employer account!',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    const { account_type, ...restCreateUserDto } = createUserDto;

    const accountType = await this.prisma.accountType.findFirst({
      where: { name: account_type },
    });

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: {
        ...restCreateUserDto,
        type: {
          connect: {
            id: accountType.id,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number, options?: { type?: boolean }) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { type: options?.type ?? false },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
