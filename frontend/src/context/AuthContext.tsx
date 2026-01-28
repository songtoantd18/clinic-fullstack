import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'clinic' | 'patient' | null

interface User {
  id: string
  role: UserRole
  email: string
}

interface AuthContextType {
  user: User | null
  role: UserRole
  login: (data: any) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setRole(parsedUser.role)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      }
    }
  }, [])

  const login = (userData: any) => {
    // Check if userData has the structure from API response { access_token, user }
    if (userData.access_token && userData.user) {
      const { access_token, user: userInfo } = userData
      setUser(userInfo)
      setRole(userInfo.role)
      localStorage.setItem('user', JSON.stringify(userInfo))
      localStorage.setItem('access_token', access_token)
    } else {
      // Fallback for direct user object (if needed or for legacy support)
      setUser(userData)
      setRole(userData.role)
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }

  const value: AuthContextType = {
    user,
    role,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
