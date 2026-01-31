
import client from '../api/client'

export enum AppointmentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Interface linh động - chỉ define những field quan trọng
export interface Appointment {
  id: string
  appointmentTime: string
  status: string
  symptoms?: string
  clinicUser?: any
  patientUser?: any
  [key: string]: any  // Nhận tất cả field khác từ backend
}

export interface CreateAppointmentDto {
  clinicUserId: string
  appointmentTime: string
  symptoms: string
}

export const appointmentService = {
  // Create appointment
  createAppointment: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await client.post('/appointments', data)
    return response.data
  },

  // Get my appointments (filtered by role and userId)
  getMyAppointments: async (role: 'clinic' | 'patient', userId: string): Promise<Appointment[]> => {
    const params = role === 'patient' ? { patientId: userId } : { clinicId: userId }
    const response = await client.get('/appointments', { params })
    return response.data
  },

  // Get all appointments (no filter)
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await client.get('/appointments')
    return response.data
  },

  // Get available slots
  getAvailableSlots: async (clinicId: string, date: string) => {
    const response = await client.get(
      `/appointments/clinic/${clinicId}/available-slots`, 
      { params: { date } }
    )
    return response.data
  },
}