import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaUserRepository } from 'src/user/repositories/prisma-user.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'segredo_super_secreto',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
