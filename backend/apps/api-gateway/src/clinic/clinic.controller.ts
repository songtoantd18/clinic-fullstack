import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClinicService } from './clinic.service';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicController {
  constructor(private clinicService: ClinicService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clinics with optional filters' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'location', required: false })
  async findAll(
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
  ) {
    return this.clinicService.findAll(specialty, location);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  async findOne(@Param('id') id: string) {
    return this.clinicService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update clinic information' })
  async update(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicService.update(id, updateClinicDto);
  }

  @Put(':id/working-hours')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update clinic working hours' })
  async updateWorkingHours(
    @Param('id') id: string,
    @Body() workingHoursDto: UpdateWorkingHoursDto,
  ) {
    return this.clinicService.updateWorkingHours(id, workingHoursDto);
  }

  @Post(':id/images')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/clinics',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload clinic image' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/clinics/${file.filename}`;
    return this.clinicService.addImage(id, imageUrl);
  }

  @Delete(':id/images')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete clinic image' })
  async deleteImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.clinicService.removeImage(id, imageUrl);
  }
}
