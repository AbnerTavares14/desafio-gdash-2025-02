import { UserWithPasswordDTO } from '../dto/user-with-password.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract create(data: User): Promise<UserDto>;
  abstract findByEmail(email: string): Promise<UserDto | null>;
  abstract findById(id: string): Promise<UserDto | null>;
  abstract findAll(): Promise<UserDto[]>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, data: User): Promise<UserDto>;
  abstract findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDTO | null>;
}
