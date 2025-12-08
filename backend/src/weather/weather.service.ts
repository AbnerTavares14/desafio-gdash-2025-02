/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { WeatherRepository } from './repositories/weather.repository';
import { CreateWeatherLogDto } from './dto/weather-log.dto';
import { ok, err, Result } from 'neverthrow';
import { Prisma, WeatherLog } from '@prisma/client';
import { WeatherCreationError } from './errors/weather.error';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherRepository: WeatherRepository) {}

  async createLog(
    data: CreateWeatherLogDto,
  ): Promise<Result<WeatherLog, WeatherCreationError>> {
    try {
      let finalDate: Date;

      if (data.collectedAt) {
        finalDate = new Date(data.collectedAt);
      } else {
        finalDate = new Date();
      }

      if (isNaN(finalDate.getTime())) {
        console.warn(
          `Data inválida recebida (${data.collectedAt}), usando data atual.`,
        );
        finalDate = new Date();
      }

      const safeFullData = data.fullData
        ? (data.fullData as any)
        : Prisma.DbNull;

      const log = await this.weatherRepository.create({
        latitude: data.latitude,
        longitude: data.longitude,
        temperature: data.temperature,
        humidity: data.humidity,
        precipitationProb: data.precipitationProb || 0,
        windSpeed: data.windSpeed,
        condition: data.condition,
        conditionString: data.conditionString,
        collectedAt: finalDate,
        fullData: safeFullData,
      });

      return ok(log);
    } catch (error) {
      console.error('Erro ao salvar log:', error);
      return err(
        new WeatherCreationError('Falha ao persistir dados climáticos'),
      );
    }
  }

  async generateXlsx(): Promise<Buffer> {
    const logs = await this.weatherRepository.findAll();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dados Climáticos');

    worksheet.columns = [
      { header: 'Data/Hora', key: 'date', width: 25 },
      { header: 'Temp (°C)', key: 'temp', width: 15 },
      { header: 'Umidade (%)', key: 'hum', width: 15 },
      { header: 'Vento (km/h)', key: 'wind', width: 15 },
      { header: 'Condição', key: 'cond', width: 25 },
    ];

    logs.forEach((log) => {
      worksheet.addRow({
        date: log.collectedAt.toLocaleString('pt-BR'),
        temp: log.temperature,
        hum: log.humidity,
        wind: log.windSpeed,
        cond: log.conditionString,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generateCsv(): Promise<string> {
    const logs = await this.weatherRepository.findAll();
    const fields = [
      'collectedAt',
      'temperature',
      'humidity',
      'windSpeed',
      'conditionString',
    ];
    const opts = { fields };

    const data = logs.map((log) => ({
      collectedAt: log.collectedAt.toISOString(),
      temperature: log.temperature,
      humidity: log.humidity,
      windSpeed: log.windSpeed,
      conditionString: log.conditionString,
    }));

    const parser = new Parser(opts);
    return parser.parse(data);
  }

  async getLogs() {
    return await this.weatherRepository.findAll();
  }
}
