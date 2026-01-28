import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clinicName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  specialties?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  workingHours?: {
    [key: string]: { start: string; end: string; isOpen: boolean };
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  doctorInfo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  notificationSettings?: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderHours: number;
  };
}
