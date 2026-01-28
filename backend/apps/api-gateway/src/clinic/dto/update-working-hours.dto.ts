import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkingHoursDto {
  @ApiProperty({
    example: {
      monday: { start: '08:00', end: '17:00', isOpen: true },
      tuesday: { start: '08:00', end: '17:00', isOpen: true },
      wednesday: { start: '08:00', end: '17:00', isOpen: true },
      thursday: { start: '08:00', end: '17:00', isOpen: true },
      friday: { start: '08:00', end: '17:00', isOpen: true },
      saturday: { start: '08:00', end: '12:00', isOpen: true },
      sunday: { start: '00:00', end: '00:00', isOpen: false },
    },
  })
  @IsObject()
  workingHours: {
    [key: string]: { start: string; end: string; isOpen: boolean };
  };
}
