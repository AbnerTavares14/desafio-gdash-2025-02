import { Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import bcrypt from 'bcrypt';
import { err, Result, ok } from 'neverthrow';
import { User } from '@prisma/client';
import { AuthenticationFailed } from './errors/auth.error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    auth: AuthDTO,
  ): Promise<Result<Partial<User>, AuthenticationFailed>> {
    const user = await this.userRepo.findByEmailWithPassword(auth.email);

    if (!user) {
      return err(new AuthenticationFailed());
    }

    const isPasswordCorrect = await bcrypt.compare(
      auth.password,
      user.password,
    );

    if (isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return ok(result);
    }

    return err(new AuthenticationFailed());
  }

  login(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
