import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrescriptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({
    required: false,
    example: {
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '5 days',
        },
      ],
      notes: 'Take after meals',
    },
  })
  @IsOptional()
  @IsObject()
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    notes: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  testResults?: string;
}
