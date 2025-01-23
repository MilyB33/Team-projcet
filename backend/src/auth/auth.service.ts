import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      user,
    };
  }

  async me(token: string) {
    const decodedToken: { userId: number } | null =
      this.jwtService.decode(token);

    if (!decodedToken) {
      throw new BadRequestException('Bad token');
    }

    const user = await this.usersService.findOne(decodedToken.userId);

    return user;
  }
}
