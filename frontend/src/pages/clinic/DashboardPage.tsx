import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { appointmentService, Appointment } from '../../services/appointment.service'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    uniquePatients: 0,
    upcomingAppointments: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          setLoading(true)
          // Fetch all appointments for this clinic
          const data = await appointmentService.getMyAppointments('clinic', user.id)
          setAppointments(data)

          // Calculate statistics
          const total = data.length
          const uniquePatients = new Set(data.map(apt => apt.patientUserId)).size
          const upcoming = data.filter(apt => {
            const aptDate = new Date(apt.appointmentTime)
            return aptDate > new Date() && apt.status !== 'cancelled'
          }).length

          setStats({
            totalAppointments: total,
            uniquePatients,
            upcomingAppointments: upcoming,
          })
        } catch (error) {
          console.error('Failed to fetch appointments:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  // Get upcoming appointments (next 5)
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.appointmentTime)
      return aptDate > new Date() && apt.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Clinic Booking System
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Clinic Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Welcome to the clinic dashboard. Here you can manage your clinic, appointments, and patients.
          </p>

          {loading ? (
            <div className="text-center py-8">Loading dashboard data...</div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Appointments</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Patients</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.uniquePatients}</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Appointments</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.upcomingAppointments}</p>
                </div>
              </div>

              {/* Upcoming Appointments List */}
              {upcomingAppointments.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => {
                      const aptDate = new Date(apt.appointmentTime)
                      return (
                        <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {apt.patientUser?.fullName || 'Patient'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {aptDate.toLocaleDateString()} at {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Symptoms: {apt.symptoms || 'N/A'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/clinic/appointments"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center block"
                  >
                    View All Appointments
                  </Link>
                  <button
                    onClick={() => alert('Clinic Settings page - Coming soon!')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Clinic Settings
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
