import client from '../api/client'

export interface UpdateProfileDto {
  // Patient fields
  fullName?: string
  idNumber?: string
  dateOfBirth?: string
  
  // Clinic fields
  clinicName?: string
  description?: string
  specialties?: string[]
  workingHours?: {
    [key: string]: { start: string; end: string; isOpen: boolean }
  }
  doctorInfo?: string
  notificationSettings?: {
    emailEnabled: boolean
    smsEnabled: boolean
    reminderHours: number
  }
  
  // Shared fields
  phone?: string
  address?: string
}

export interface UserProfile {
  id: string
  email: string
  role: 'clinic' | 'patient'
  
  // Patient fields
  fullName?: string
  idNumber?: string
  dateOfBirth?: string
  profileCompleted?: boolean
  
  // Clinic fields
  clinicName?: string
  description?: string
  specialties?: string[]
  workingHours?: any
  images?: string[]
  doctorInfo?: string
  notificationSettings?: any
  
  // Shared
  phone?: string
  address?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await client.get<UserProfile>('/users/profile')
    return response.data
  },

  // Update user profile (auto-detect role on backend)
  updateProfile: async (data: UpdateProfileDto): Promise<UserProfile> => {
    const response = await client.put<UserProfile>('/users/profile', data)
    return response.data
  },

  // Add image to clinic profile
  addImage: async (imageUrl: string): Promise<UserProfile> => {
    const response = await client.post<UserProfile>('/users/profile/images', { imageUrl })
    return response.data
  },

  // Remove image from clinic profile
  removeImage: async (imageUrl: string): Promise<UserProfile> => {
    const response = await client.delete<UserProfile>('/users/profile/images', { 
      data: { imageUrl } 
    })
    return response.data
  },
}
