import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from './appointment.entity';

export enum UserRole {
  CLINIC = 'clinic',
  PATIENT = 'patient',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ nullable: true, name: 'google_id' })
  googleId: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // ============ PATIENT FIELDS ============
  @Column({ nullable: true, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true, name: 'id_number' })
  idNumber: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ default: false, name: 'profile_completed' })
  profileCompleted: boolean;

  // ============ CLINIC FIELDS ============
  @Column({ nullable: true, name: 'clinic_name' })
  clinicName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'json', nullable: true, name: 'working_hours' })
  workingHours: {
    [key: string]: { start: string; end: string; isOpen: boolean };
  };

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true, name: 'doctor_info' })
  doctorInfo: string;

  @Column({ type: 'json', nullable: true, name: 'notification_settings' })
  notificationSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderHours: number;
  };

  // ============ SHARED FIELDS ============
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  // ============ RELATIONSHIPS ============
  @OneToMany(() => Appointment, (appointment) => appointment.clinicUser)
  clinicAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.patientUser)
  patientAppointments: Appointment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
