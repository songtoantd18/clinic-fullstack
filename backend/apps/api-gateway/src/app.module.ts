import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  DatabaseModule,             // Kết nối database (TypeORM)
    AuthModule,                 // Module xử lý authentication ⭐
    UserModule,                 // Module quản lý user
    AppointmentModule,          // Module quản lý appointment
  ],
})
export class AppModule {}
