import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './models/user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ok, err, Result } from 'neverthrow';
import { UserAlreadyExistsError, UserNotFound } from './errors/user.errors';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async create(
    data: CreateUserDTO,
  ): Promise<Result<UserDto, UserAlreadyExistsError>> {
    const isUserAlreadyRegistered = await this.userRepo.findByEmail(data.email);

    if (isUserAlreadyRegistered) {
      return err(new UserAlreadyExistsError(data.email));
    }

    const saltOrRounds = await bcrypt.genSalt();

    const encryptedPassword = await bcrypt.hash(data.password, saltOrRounds);

    data.password = encryptedPassword;

    const newUser = new User(data);

    const result = await this.userRepo.create(newUser);

    return ok(result);
  }

  async listUsers() {
    return await this.userRepo.findAll();
  }

  async getById(id: string) {
    return await this.userRepo.findById(id);
  }

  async updateUser(
    id: string,
    data: UpdateUserDTO,
  ): Promise<Result<UserDto, UserAlreadyExistsError>> {
    const isAvailableEmail = await this.userRepo.findByEmail(data.email);
    if (
      isAvailableEmail &&
      isAvailableEmail.email === data.email &&
      id !== isAvailableEmail.id
    ) {
      return err(new UserAlreadyExistsError(data.email));
    }

    if (data.password && data.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    const result = await this.userRepo.update(id, data as User);

    return ok(result);
  }

  async deleteUser(id: string): Promise<Result<void, UserNotFound>> {
    const userExists = await this.userRepo.findById(id);
    if (!userExists) {
      return err(new UserNotFound());
    }
    await this.userRepo.delete(id);
    return ok();
  }
}
