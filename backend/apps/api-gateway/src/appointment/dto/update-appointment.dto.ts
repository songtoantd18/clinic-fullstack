import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  appointmentTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  symptoms?: string;
}
