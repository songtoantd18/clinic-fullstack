import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '@app/database';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(specialty?: string, location?: string) {
    const where: any = { role: UserRole.CLINIC };
    
    if (specialty) {
      where.specialties = Like(`%${specialty}%`);
    }
    
    if (location) {
      where.address = Like(`%${location}%`);
    }

    return await this.userRepository.find({ where });
  }

  async findOne(id: string) {
    const clinic = await this.userRepository.findOne({ 
      where: { id, role: UserRole.CLINIC } 
    });
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
    return clinic;
  }

  async findByUserId(userId: string) {
    return await this.userRepository.findOne({ 
      where: { id: userId, role: UserRole.CLINIC } 
    });
  }

  async update(id: string, updateClinicDto: UpdateClinicDto) {
    const clinic = await this.findOne(id);
    Object.assign(clinic, updateClinicDto);
    return await this.userRepository.save(clinic);
  }

  async updateWorkingHours(id: string, workingHoursDto: UpdateWorkingHoursDto) {
    const clinic = await this.findOne(id);
    clinic.workingHours = workingHoursDto.workingHours;
    return await this.userRepository.save(clinic);
  }

  async addImage(id: string, imageUrl: string) {
    const clinic = await this.findOne(id);
    if (!clinic.images) {
      clinic.images = [];
    }
    clinic.images.push(imageUrl);
    return await this.userRepository.save(clinic);
  }

  async removeImage(id: string, imageUrl: string) {
    const clinic = await this.findOne(id);
    if (clinic.images) {
      clinic.images = clinic.images.filter(img => img !== imageUrl);
      return await this.userRepository.save(clinic);
    }
    return clinic;
  }
}
