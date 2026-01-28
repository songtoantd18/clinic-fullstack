import client from '../api/client'

export interface Clinic {
  id: string
  name: string
  description: string
  address: string
  phoneNumber: string
  specialty: string
  workingHours: any
  images: string[]
  createdAt: string
  updatedAt: string
}

export const clinicService = {
  // Get all clinics with optional filters
  getAllClinics: async (params?: { specialty?: string; location?: string }) => {
    const response = await client.get<Clinic[]>('/clinics', { params })
    return response.data
  },

  // Get clinic by ID
  getClinicById: async (id: string) => {
    const response = await client.get<Clinic>(`/clinics/${id}`)
    return response.data
  },
}
