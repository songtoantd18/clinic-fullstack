import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@app/database';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: UserRole) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role-specific fields
    const userData: Partial<User> = {
      email,
      password: hashedPassword,
      role,
    };

    // Set default values based on role
    if (role === UserRole.CLINIC) {
      userData.clinicName = 'My Clinic'; // Default name
      userData.description = '';
      userData.address = '';
      userData.phone = '';
      userData.specialties = [];
      userData.workingHours = null;
      userData.images = null;
      userData.doctorInfo = null;
      userData.notificationSettings = null;
    } else if (role === UserRole.PATIENT) {
      userData.fullName = '';
      userData.profileCompleted = false;
      userData.phone = null;
      userData.idNumber = null;
      userData.dateOfBirth = null;
      userData.address = null;
    }

    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.formatUserResponse(user),
    };
  }

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUserCredentials(email, password);
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.formatUserResponse(user),
    };
  }

  async validateClinicUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, role: UserRole.CLINIC },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async loginClinic(email: string, password: string) {
    const user = await this.validateClinicUser(email, password);
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.formatUserResponse(user),
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email, googleId, firstName, lastName } = req.user;

    let user = await this.userRepository.findOne({
      where: { googleId },
    });

    if (!user) {
      // Create new user with patient role and fields
      user = this.userRepository.create({
        email,
        googleId,
        role: UserRole.PATIENT,
        fullName: `${firstName} ${lastName}`,
        profileCompleted: false,
      });
      await this.userRepository.save(user);
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: this.formatUserResponse(user),
    };
  }

  async validateUser(userId: string) {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  // Helper method to format user response based on role
  private formatUserResponse(user: User) {
    const baseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    if (user.role === UserRole.CLINIC) {
      return {
        ...baseUser,
        clinicName: user.clinicName,
        description: user.description,
        address: user.address,
        phone: user.phone,
        specialties: user.specialties,
        workingHours: user.workingHours,
        images: user.images,
        doctorInfo: user.doctorInfo,
        notificationSettings: user.notificationSettings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } else if (user.role === UserRole.PATIENT) {
      return {
        ...baseUser,
        fullName: user.fullName,
        phone: user.phone,
        idNumber: user.idNumber,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    return baseUser;
  }
}
