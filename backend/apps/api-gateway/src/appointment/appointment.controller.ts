import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { AppointmentStatus } from '@app/database';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiQuery({ name: 'submit', required: false, type: Boolean, description: 'Set to true to submit immediately, false/omit for draft' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Query('submit') submit?: boolean,
    @Req() req?,
  ) {
    // req.user.id is the patient's user ID (from JWT token)
    const patientUserId = req.user.id;
    const isDraft = submit !== true; // Default is draft unless submit=true
    return this.appointmentService.create(createAppointmentDto, patientUserId, isDraft);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointments with filters' })
  @ApiQuery({ name: 'clinicId', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  async findAll(
    @Query('clinicUserId') clinicUserId?: string,
    @Query('patientUserId') patientUserId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.findAll({
      clinicUserId,
      patientUserId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status,
    });
  }

  @Get('clinic/:clinicId/available-slots')
  @ApiOperation({ summary: 'Get available time slots for a clinic on a specific date' })
  @ApiQuery({ name: 'date', required: true })
  async getAvailableSlots(
    @Param('clinicId') clinicId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentService.getAvailableSlots(
      clinicId,
      new Date(date),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment by ID' })
  async findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Put(':id/submit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit draft appointment' })
  async submitDraft(@Param('id') id: string, @Req() req) {
    return this.appointmentService.submitDraft(id, req.user.id);
  }


  @Put(':id/prescription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add/update prescription and diagnosis' })
  async updatePrescription(
    @Param('id') id: string,
    @Body() prescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.appointmentService.updatePrescription(id, prescriptionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel appointment' })
  async cancel(@Param('id') id: string) {
    return this.appointmentService.cancel(id);
  }
}
