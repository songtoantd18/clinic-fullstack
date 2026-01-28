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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateClinicProfileDto, UpdatePatientProfileDto } from './dto';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  // ============ USER PROFILE ENDPOINTS ============

  @Put('users/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile (auto-detect role)' })
  async updateProfile(
    @Req() req,
    @Body() updateDto: UpdateClinicProfileDto | UpdatePatientProfileDto,
  ) {
    return this.userService.updateProfile(req.user.id, updateDto, req.user.role);
  }

  @Get('users/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile' })
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // ============ CLINIC ENDPOINTS (PUBLIC) ============

  @Get('clinics')
  @ApiOperation({ summary: 'List all clinics' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'location', required: false })
  async listClinics(
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
  ) {
    return this.userService.listClinics(specialty, location);
  }

  @Get('clinics/:id')
  @ApiOperation({ summary: 'Get clinic details' })
  async getClinicById(@Param('id') id: string) {
    return this.userService.getClinicById(id);
  }

  // ============ CLINIC IMAGE MANAGEMENT ============

  @Post('users/profile/images')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add image to clinic profile' })
  async addImage(@Req() req, @Body('imageUrl') imageUrl: string) {
    return this.userService.addImage(req.user.id, imageUrl);
  }

  @Delete('users/profile/images')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove image from clinic profile' })
  async removeImage(@Req() req, @Body('imageUrl') imageUrl: string) {
    return this.userService.removeImage(req.user.id, imageUrl);
  }
}
