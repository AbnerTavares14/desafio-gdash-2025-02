import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './repositories/weather.repository';
import { PrismaWeatherRepository } from './repositories/prisma-weather.repository';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: WeatherRepository,
      useClass: PrismaWeatherRepository,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
