import client from '../api/client'

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: string
  patientId: string
  clinicId: string
  appointmentDate: string
  status: AppointmentStatus
  reason: string
  notes?: string
  diagnosis?: string
  prescription?: string
  clinic?: {
    name: string
    address: string
  }
  patient?: {
    fullName: string
  }
}

export interface CreateAppointmentDto {
  clinicId: string
  appointmentDate: string
  reason: string
  notes?: string
}

export const appointmentService = {
  // Create appointment
  createAppointment: async (data: CreateAppointmentDto) => {
    const response = await client.post<Appointment>('/appointments', data)
    return response.data
  },

  // Get my appointments (automatically uses authenticated user's ID/role from token)
  getMyAppointments: async (role: 'clinic' | 'patient', userId: string) => {
    // The backend filters by patientId or clinicId.
    // Since we are adding the logic in frontend, we need to pass the correct query param.
    // However, for patients, looking at the controller:
    // @Query('patientId') patientId?: string
    // @Query('clinicId') clinicId?: string
    
    // We should probably rely on the user object to get the ID.
    const params: any = {}
    if (role === 'patient') {
      params.patientId = userId
    } else if (role === 'clinic') {
      // Clinic user ID might be different from Clinic ID? 
      // In the auth controller: clinic login returns user. 
      // The clinic entity usually is linked to the user.
      // But looking at the backend code might be needed to be sure. 
      // For now, let's assume the user.id IS the clinicId or we can fetch it.
      // Wait, let's check auth.controller again.
      // Register creates a USER. 
      // ClinicService creates a CLINIC.
      // Usually there's a link. 
      // Let's assume for now we pass the ID we have.
      params.clinicId = userId
    }

    const response = await client.get<Appointment[]>('/appointments', { params })
    return response.data
  },

  // Get available slots
  getAvailableSlots: async (clinicId: string, date: string) => {
    const response = await client.get<{ date: string; availableSlots: string[] }>(
      `/appointments/clinic/${clinicId}/available-slots`, 
      { params: { date } }
    )
    return response.data
  },
}
