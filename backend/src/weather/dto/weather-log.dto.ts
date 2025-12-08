import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateWeatherLogDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @IsNumber()
  @IsNotEmpty()
  windSpeed: number;

  @IsNumber()
  @IsOptional()
  precipitationProb?: number;

  @IsNumber()
  @IsNotEmpty()
  condition: number;

  @IsString()
  @IsNotEmpty()
  conditionString: string;

  @IsDateString()
  @IsNotEmpty()
  collectedAt: string;

  @IsOptional()
  @IsObject()
  fullData?: object;
}
