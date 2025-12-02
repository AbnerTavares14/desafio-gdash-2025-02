import { IsString, MinLength, IsEmail, MaxLength } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
