import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { clinicService, Clinic } from '../../services/clinic.service'

import { appointmentService } from '../../services/appointment.service'

export default function ClinicsPage() {
  const { user, logout } = useAuth()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [reason, setReason] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('09:00') // Default time
  const [bookingLoading, setBookingLoading] = useState(false)

  const openBookingModal = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setReason('')
    // Default to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setAppointmentDate(tomorrow.toISOString().split('T')[0])
    setAppointmentTime('09:00')
  }

  const closeBookingModal = () => {
    setSelectedClinic(null)
    setReason('')
    setAppointmentDate('')
    setAppointmentTime('')
  }

  const handleConfirmAppointment = async () => {
    if (!selectedClinic || !appointmentDate || !appointmentTime || !reason) {
      alert('Please fill in all fields')
      return
    }

    try {
      setBookingLoading(true)
      // Combine date and time
      const dateTimeString = `${appointmentDate}T${appointmentTime}:00`
      const fullDate = new Date(dateTimeString)

      await appointmentService.createAppointment({
        clinicUserId: selectedClinic.id,
        appointmentTime: fullDate.toISOString(),
        symptoms: reason,
      })
      alert('Appointment created successfully!')
      closeBookingModal()
    } catch (err: any) {
      console.error('Booking failed:', err)
      alert(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await clinicService.getAllClinics()
        setClinics(data)
      } catch (err) {
        console.error('Failed to fetch clinics:', err)
        setError('Failed to load clinics. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [])

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
              <Link to="/patient/appointments" className="text-gray-600 hover:text-gray-900">
                My Appointments
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Clinics111</h1>

          {loading ? (
            <div className="text-center py-8">Loading clinics...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-8">No clinics found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="border rounded-lg p-6 hover:shadow-lg transition">
                  {clinic.images && clinic.images.length > 0 && (
                    <img
                      src={`http://localhost:3000${clinic.images[0]}`}
                      alt={clinic.clinicName || 'Clinic'}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {clinic.clinicName || clinic.fullName || 'Unnamed Clinic'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> {clinic.email}
                  </p>
                  {clinic.specialties && clinic.specialties.length > 0 && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Specialties:</span> {clinic.specialties.join(', ')}
                    </p>
                  )}
                  {clinic.address && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Address:</span> {clinic.address}
                    </p>
                  )}
                  {clinic.phone && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Phone:</span> {clinic.phone}
                    </p>
                  )}
                  {clinic.description && (
                    <p className="text-gray-600 mb-2 text-sm italic">{clinic.description}</p>
                  )}
                  <div className="flex items-center mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${clinic.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {clinic.profileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                    </span>
                  </div>
                  <button onClick={() => openBookingModal(clinic)} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main >

      {/* Booking Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Book Appointment</h3>
            <p className="text-gray-600 mb-4">Clinic: {selectedClinic.clinicName || selectedClinic.fullName}</p>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date & Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Symptoms / Reason
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                placeholder="Describe your symptoms (e.g. Headache, fever...)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeBookingModal}
                disabled={bookingLoading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAppointment}
                disabled={bookingLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}
