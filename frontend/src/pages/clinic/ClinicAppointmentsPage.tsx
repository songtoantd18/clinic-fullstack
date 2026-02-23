import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { appointmentService, Appointment } from '../../services/appointment.service'

export default function ClinicAppointmentsPage() {
    const { user, logout } = useAuth()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('all')

    useEffect(() => {
        fetchAppointments()
    }, [user])

    const fetchAppointments = async () => {
        if (user?.id) {
            try {
                setLoading(true)
                const data = await appointmentService.getMyAppointments('clinic', user.id)
                setAppointments(data)
            } catch (error) {
                console.error('Failed to fetch appointments:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    // Filter appointments by status
    const filteredAppointments = filterStatus === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === filterStatus)

    // Sort by appointment time (newest first)
    const sortedAppointments = [...filteredAppointments].sort((a, b) =>
        new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
    )

    const getStatusDisplay = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
        }
        return statusMap[status.toLowerCase()] || statusMap.draft
    }

    const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) {
            return
        }

        try {
            await appointmentService.updateAppointment(appointmentId, { status: newStatus } as any)
            alert('Appointment status updated successfully!')
            await fetchAppointments()
        } catch (error: any) {
            console.error('Failed to update appointment:', error)
            alert(error.response?.data?.message || 'Failed to update appointment')
        }
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
                            <Link to="/clinic/dashboard" className="text-gray-600 hover:text-gray-900">
                                Dashboard
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>

                        {/* Filter by Status */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Filter:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading appointments...</div>
                    ) : sortedAppointments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Patient</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Symptoms</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAppointments.map((apt) => {
                                        const appointmentDate = new Date(apt.appointmentTime)
                                        const statusInfo = getStatusDisplay(apt.status)

                                        return (
                                            <tr key={apt.id} className="border-t hover:bg-gray-50">
                                                <td className="px-6 py-3 text-sm text-gray-900">
                                                    {apt.patientUser?.fullName || apt.patientUser?.email || 'Unknown Patient'}
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
                                                    {apt.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                                            className="text-green-600 hover:text-green-900 mr-2"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {apt.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {(apt.status === 'cancelled' || apt.status === 'completed' || apt.status === 'draft') && (
                                                        <span className="text-gray-400">No actions</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">
                            {filterStatus === 'all' ? 'No appointments found.' : `No ${filterStatus} appointments found.`}
                        </p>
                    )}

                    {/* Summary */}
                    {!loading && appointments.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                            <p className="text-sm text-gray-600">
                                Showing {sortedAppointments.length} of {appointments.length} appointments
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
