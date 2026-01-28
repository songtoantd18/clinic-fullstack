import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  clinicUserId: string;

  @ApiProperty({ example: '2024-01-20T10:00:00Z' })
  @IsDateString()
  appointmentTime: string;

  @ApiProperty()
  @IsString()
  symptoms: string;
}
