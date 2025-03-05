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
import * as sgMail from '@sendgrid/mail';

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

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign({ email }, { expiresIn: '1h' });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

    const msg = {
      to: email,
      from: process.env.SENDGIRD_SENDER,
      subject: 'Reset password',
      text: `Reset your password by clicking on the following link: ${resetLink}`,
      html: `<p>Reset your password by clicking <a href="${resetLink}">here</a>.</p>`,
    };

    sgMail
      .send(msg)
      .then(() => console.log('Reset password email sent successfully'))
      .catch((error) => console.error('Error sending email:', error));

    return { message: 'Password reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded: { email: string } = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.usersService.update(user.id, {
        email: decoded.email,
        password: newPassword,
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
