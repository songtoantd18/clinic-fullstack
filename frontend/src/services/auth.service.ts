import { request } from '../api/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: 'clinic' | 'patient'
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    role: 'clinic' | 'patient'
  }
}

export const authService = {
  // Login (Unified)
  login: async (credentials: LoginCredentials) => {
    return await request<AuthResponse>('/auth/login', credentials, 'post')
  },

  // Clinic Login (Legacy - kept for compatibility if needed, but login handles it)
  loginClinic: async (credentials: LoginCredentials) => {
    return await request<AuthResponse>('/auth/clinic/login', credentials, 'post')
  },

  // Register (Both Clinic and Patient)
  register: async (data: RegisterData) => {
    return await request('/auth/register', data, 'post')
  },

  // Get Profile
  getProfile: async () => {
    return await request('/auth/profile', {}, 'get')
  },
}
