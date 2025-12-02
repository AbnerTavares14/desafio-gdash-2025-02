import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { User } from '../models/user.model';
import { UserDto } from '../dto/user.dto';
import { UserWithPasswordDTO } from '../dto/user-with-password.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDTO | null> {
    return await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string): Promise<UserDto | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserDto> {
    return await this.prisma.user.create({ data });
  }

  async findAll(): Promise<UserDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: User): Promise<UserDto> {
    return await this.prisma.user.update({
      data,
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
