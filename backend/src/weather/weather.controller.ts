import {
  Body,
  Controller,
  Get,
  Post,
  InternalServerErrorException,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { WeatherService } from './weather.service';
import { CreateWeatherLogDto } from './dto/weather-log.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('weather')
@UseGuards(AuthGuard('jwt'))
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('logs')
  async create(@Body() createDto: CreateWeatherLogDto) {
    const result = await this.weatherService.createLog(createDto);

    return result.match(
      (log) => log,
      (error) => {
        throw new InternalServerErrorException(error.message);
      },
    );
  }

  @Get('logs')
  async findAll() {
    return this.weatherService.getLogs();
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.weatherService.generateCsv();
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=weather_data.csv');
    res.send(csv);
  }

  @Get('export/xlsx')
  async exportXlsx(@Res() res: Response) {
    const buffer = await this.weatherService.generateXlsx();
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.header('Content-Disposition', 'attachment; filename=weather_data.xlsx');
    res.send(buffer);
  }

}
