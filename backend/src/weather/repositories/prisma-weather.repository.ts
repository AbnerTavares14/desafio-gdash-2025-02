import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WeatherRepository } from './weather.repository';
import { WeatherLog, Prisma } from '@prisma/client';

@Injectable()
export class PrismaWeatherRepository implements WeatherRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.WeatherLogCreateInput): Promise<WeatherLog> {
    return this.prisma.weatherLog.create({
      data,
    });
  }

  findAll(): Promise<WeatherLog[]> {
    return this.prisma.weatherLog.findMany({
      orderBy: { collectedAt: 'desc' },
      take: 100,
    });
  }
}
