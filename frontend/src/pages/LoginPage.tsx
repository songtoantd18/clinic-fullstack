import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { request } from '../api/api'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Role is now determined by backend response
  // const [role, setRole] = useState<'clinic' | 'patient'>('patient')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, role, isLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {

    console.log("🔍 ~ LoginPage ~ frontend/src/pages/LoginPage.tsx:17 ~ useEffect ~ isLoading:", isLoading)
    console.log("🔍 ~ LoginPage ~ frontend/src/pages/LoginPage.tsx:17 ~ useEffect ~ isAuthenticated:", isAuthenticated)
    console.log("🔍 ~ LoginPage ~ frontend/src/pages/LoginPage.tsx:17 ~ useEffect ~ role:", role)
    if (!isLoading && isAuthenticated && role) {
      if (role === 'clinic') {
        navigate('/clinic/dashboard')
      } else {
        navigate('/patient/dashboard')
      }
    }
  }, [isLoading, isAuthenticated, role, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await request(
        'auth/login',
        {
          email,
          password,
        },
        'post'
      )
      console.log("🔍 ~ LoginPage ~ frontend/src/pages/LoginPage.tsx:21 ~ response:", response);

      // 👉 Kiểm tra nếu response có lỗi (statusCode !== undefined)
      if (response.statusCode) {
        // Response lỗi: { message, error, statusCode }
        alert(response.message || 'Login failed. Please try again.')
        return
      }

      // 👉 Response thành công: { access_token, user }
      const { access_token, user } = response

      // lưu token và user vào localStorage để duy trì đăng nhập
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      // lưu user vào auth context
      login(user)

      // redirect theo role trả về từ backend
      if (user.role === 'clinic') {
        navigate('/clinic/dashboard')
      } else {
        navigate('/patient/dashboard')
      }
    } catch (error: any) {
      // 👉 Chỉ catch network errors (không có response từ server)
      console.error('Network error:', error)
      alert('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">Clinic Booking System</h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role selection is automatically handled by the system based on your account credentials */}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="clinic@gmail.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-600 text-center">
              Demo: Use any email/password combination to login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
