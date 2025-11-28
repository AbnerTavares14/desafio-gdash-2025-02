import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract create(data: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract delete(id: string): Promise<void>;
  abstract update(id: string, data: User): Promise<User>;
}
