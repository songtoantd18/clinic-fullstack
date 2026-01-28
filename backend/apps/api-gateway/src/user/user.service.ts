import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '@app/database';
import { UpdateClinicProfileDto, UpdatePatientProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Update user profile based on role
  async updateProfile(userId: string, updateDto: any, role: UserRole) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate that user is updating their own role's fields
    if (user.role !== role) {
      throw new BadRequestException('Role mismatch');
    }

    // Update fields
    Object.assign(user, updateDto);

    // Check if patient profile is complete
    if (role === UserRole.PATIENT) {
      if (
        user.fullName &&
        user.phone &&
        user.idNumber &&
        user.dateOfBirth
      ) {
        user.profileCompleted = true;
      }
    }

    return await this.userRepository.save(user);
  }

  // Get user profile
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  // Get user by ID (public)
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  // List all clinics (public)
  async listClinics(specialty?: string, location?: string) {
    const where: any = { role: UserRole.CLINIC };

    if (specialty) {
      where.specialties = Like(`%${specialty}%`);
    }

    if (location) {
      where.address = Like(`%${location}%`);
    }

    const clinics = await this.userRepository.find({ where });

    // Remove password from all results
    return clinics.map(({ password, ...clinic }) => clinic);
  }

  // Get clinic by ID (public)
  async getClinicById(id: string) {
    const clinic = await this.userRepository.findOne({
      where: { id, role: UserRole.CLINIC },
    });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const { password, ...result } = clinic;
    return result;
  }

  // Add image to clinic
  async addImage(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: UserRole.CLINIC },
    });

    if (!user) {
      throw new NotFoundException('Clinic not found');
    }

    if (!user.images) {
      user.images = [];
    }

    user.images.push(imageUrl);
    return await this.userRepository.save(user);
  }

  // Remove image from clinic
  async removeImage(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: UserRole.CLINIC },
    });

    if (!user) {
      throw new NotFoundException('Clinic not found');
    }

    if (user.images) {
      user.images = user.images.filter(img => img !== imageUrl);
      return await this.userRepository.save(user);
    }

    return user;
  }
}
