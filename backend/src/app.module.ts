import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
