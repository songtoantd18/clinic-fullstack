import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { appointmentService, Appointment } from '../../services/appointment.service'

export default function AppointmentsPage() {
  const { user, role, logout } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  console.log("🔍 ~ AppointmentsPage ~ frontend/src/pages/patient/AppointmentsPage.tsx:9 ~ co:", appointments);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.id && role) {
        try {
          const data = await appointmentService.getMyAppointments(role, user.id)
          setAppointments(data)
        } catch (error) {
          console.error('Failed to fetch appointments:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAppointments()
  }, [user, role])

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    }
    return statusMap[status.toLowerCase()] || statusMap.draft
  }

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
              <Link to="/patient/clinics" className="text-gray-600 hover:text-gray-900">
                Browse Clinics
              </Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments111</h1>

          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Clinic</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Symptoms</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                {/* <pre>{JSON.stringify(appointments, null, 2)}</pre> */}

                <tbody>
                  {appointments.map((apt) => {
                    const appointmentDate = new Date(apt.appointmentTime)
                    const statusInfo = getStatusDisplay(apt.status)

                    return (
                      <tr key={apt.id} className="border-t">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {apt.clinicUser?.clinicName || 'Unknown Clinic'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {appointmentDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {apt.symptoms || 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No appointments found.</p>
          )}

          <div className="mt-6">
            <Link
              to="/patient/clinics"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book New Appointment
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}