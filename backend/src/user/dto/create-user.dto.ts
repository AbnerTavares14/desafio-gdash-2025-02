import { IsString, MinLength, IsEmail, MaxLength } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsString()
  name: string;
}
