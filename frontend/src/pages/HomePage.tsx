import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { isAuthenticated, role } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Clinic Booking System</h1>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 capitalize">
                  Logged in as <strong>{role}</strong>
                </span>
                <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Clinic Booking System</h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage your clinic or book appointments seamlessly
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {role === 'clinic' && (
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Clinic Dashboard123123</h3>
                  <p className="text-gray-600 mb-4">Manage your clinic, appointments, and staff</p>
                  <Link
                    to="/clinic/dashboard"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go to Clinic Dashboard 1 1 1 1
                  </Link>
                </div>
              )}

              {role === 'patient' && (
                <>
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Clinics</h3>
                    <p className="text-gray-600 mb-4">Find and view available clinics</p>
                    <Link
                      to="/patient/clinics"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Browse Clinics
                    </Link>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">My Appointments</h3>
                    <p className="text-gray-600 mb-4">View and manage your appointments</p>
                    <Link
                      to="/patient/appointments"
                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      View Appointments
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
