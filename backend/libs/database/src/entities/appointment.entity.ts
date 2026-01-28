import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AppointmentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'appointment_code' })
  appointmentCode: string;

  @Column({ name: 'clinic_user_id' })
  clinicUserId: string;

  @ManyToOne(() => User, (user) => user.clinicAppointments)
  @JoinColumn({ name: 'clinic_user_id' })
  clinicUser: User;

  @Column({ name: 'patient_user_id' })
  patientUserId: string;

  @ManyToOne(() => User, (user) => user.patientAppointments)
  @JoinColumn({ name: 'patient_user_id' })
  patientUser: User;

  @Column({ type: 'timestamp', name: 'appointment_time' })
  appointmentTime: Date;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'json', nullable: true })
  prescription: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    notes: string;
  };

  @Column({ type: 'text', nullable: true, name: 'test_results' })
  testResults: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.DRAFT,
  })
  status: AppointmentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
