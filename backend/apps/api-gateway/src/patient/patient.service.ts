import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@app/database';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: string) {
    return await this.userRepository.findOne({
      where: { id: userId, role: UserRole.PATIENT },
    });
  }

  async update(userId: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    Object.assign(patient, updatePatientDto);

    // Check if profile is complete
    if (
      patient.fullName &&
      patient.phone &&
      patient.idNumber &&
      patient.dateOfBirth
    ) {
      patient.profileCompleted = true;
    }

    return await this.userRepository.save(patient);
  }
}
