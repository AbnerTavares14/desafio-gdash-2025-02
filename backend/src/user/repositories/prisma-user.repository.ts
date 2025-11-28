import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRepository } from './user.repository';
import { Prisma } from '../../../generated/prisma/client';
import { User } from '../models/user.model';

@Injectable()
export class PrismaAuthRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async update(id: string, data: User): Promise<User> {
    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
