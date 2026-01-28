import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { clinicService, Clinic } from '../../services/clinic.service'

export default function ClinicsPage() {
  const { user, logout } = useAuth()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Clinics</h1>

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
                      alt={clinic.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Specialty:</span> {clinic.specialty}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Address:</span> {clinic.address}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Phone:</span> {clinic.phoneNumber}
                  </p>
                  {/* Working hours display could be complex, simplifying for now */}
                  <div className="flex items-center mb-4">
                    {/* Rating is not in the basic clinic entity yet, removing or adding placeholder */}
                    {/* <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-900 font-medium">{clinic.rating}</span> */}
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
