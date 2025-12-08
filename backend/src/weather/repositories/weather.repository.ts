import { WeatherLog, Prisma } from '@prisma/client';

export abstract class WeatherRepository {
  abstract create(data: Prisma.WeatherLogCreateInput): Promise<WeatherLog>;
  abstract findAll(): Promise<WeatherLog[]>;
}
