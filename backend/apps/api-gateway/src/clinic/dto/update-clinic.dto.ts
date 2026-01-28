import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

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
  @IsString()
  doctorInfo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  notificationSettings?: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderHours: number;
  };
}
