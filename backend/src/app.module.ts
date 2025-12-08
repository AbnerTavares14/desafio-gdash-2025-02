import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [UserModule, DatabaseModule, AuthModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
