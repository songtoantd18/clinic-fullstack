import client from '../api/client'

// Dynamic interface - accepts all fields from backend automatically
export type Clinic = Record<string, any> & {
  id: string
  email: string
  role: string
  clinicName?: string
  fullName?: string
  phone?: string
  address?: string
  description?: string
  specialties?: string[]
  workingHours?: any
  images?: string[] | null
  profileCompleted?: boolean
  isActive?: boolean
  createdAt: string
  updatedAt: string
  // Backend có thể thêm bất kỳ field nào, sẽ tự động nhận
}

export const clinicService = {
  // Get all clinics with optional filters
  getAllClinics: async (params?: { specialty?: string; location?: string }) => {
    const response = await client.get<Clinic[]>('/clinics', { params })
    console.log("🔍 ~ getAllClinics ~ frontend/src/services/clinic.service.ts:19 ~ variable:",response.data);
    return response.data
  },

  // Get clinic by ID
  getClinicById: async (id: string) => {
    const response = await client.get<Clinic>(`/clinics/${id}`)
    return response.data
  },
}
