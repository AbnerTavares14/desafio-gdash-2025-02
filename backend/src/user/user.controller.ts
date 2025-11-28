import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAlreadyExistsError, UserNotFound } from './errors/user.errors';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const result = await this.userService.create(createUserDTO);

    return result.match(
      (user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      },
      (error) => {
        if (error instanceof UserAlreadyExistsError) {
          throw new ConflictException(error.message);
        }
      },
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.getById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async listAll() {
    return await this.userService.listUsers();
  }

  @Put('id')
  async update(@Body() updateUser: UpdateUserDTO, @Param('id') id: string) {
    const result = await this.userService.updateUser(id, updateUser);

    return result.match(
      (user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      },
      (error) => {
        if (error instanceof UserAlreadyExistsError) {
          throw new ConflictException(error.message);
        }
      },
    );
  }

  @Delete('id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);

    return result.match(
      () => {
        return;
      },
      (error) => {
        if (error instanceof UserNotFound) {
          throw new NotFoundException(error.message);
        }
      },
    );
  }
}
