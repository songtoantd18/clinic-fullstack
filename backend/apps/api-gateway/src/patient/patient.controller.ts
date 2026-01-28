import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get patient profile' })
  async getProfile(@Req() req) {
    return this.patientService.findByUserId(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update patient profile' })
  async updateProfile(@Req() req, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(req.user.id, updatePatientDto);
  }
}
