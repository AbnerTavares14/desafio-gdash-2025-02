import {
  Controller,
  Request,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthenticationFailed } from './errors/auth.error';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: AuthDTO) {
    const result = await this.authService.validateUser(credentials);

    return result.match(
      (user) => {
        return this.authService.login({ email: user.email!, id: user.id! });
      },
      (error) => {
        if (error instanceof AuthenticationFailed) {
          throw new UnauthorizedException(error.message);
        }
      },
    );
  }
}
