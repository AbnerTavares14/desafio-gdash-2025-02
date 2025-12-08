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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAlreadyExistsError, UserNotFound } from './errors/user.errors';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const result = await this.userService.create(createUserDTO);

    return result.match(
      (user) => {
        const { ...result } = user;
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
  @UseGuards(AuthGuard('jwt'))
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

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async update(@CurrentUser() currentUser, @Body() updateUser: UpdateUserDTO) {
    console.log(currentUser);
    const result = await this.userService.updateUser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      currentUser.id,
      updateUser,
    );

    return result.match(
      (user) => {
        const { ...result } = user;
        return result;
      },
      (error) => {
        if (error instanceof UserAlreadyExistsError) {
          throw new ConflictException(error.message);
        }
      },
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async delete(@CurrentUser() currentUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const result = await this.userService.deleteUser(currentUser?.id);

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
