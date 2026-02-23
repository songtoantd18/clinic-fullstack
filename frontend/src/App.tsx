import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ClinicDashboard from './pages/clinic/DashboardPage'
import ClinicAppointments from './pages/clinic/ClinicAppointmentsPage'
import PatientAppointments from './pages/patient/AppointmentsPage'
import PatientClinics from './pages/patient/ClinicsPage'
import PatientProfile from './pages/patient/PatientProfilePage'

// Protected Route Component
const ProtectedRoute = ({ element, allowedRole }: { element: React.ReactNode; allowedRole: 'clinic' | 'patient' }) => {
  const { isAuthenticated, role, isLoading } = useAuth()

  // Đợi load xong từ localStorage trước khi redirect
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <>{element}</>
}

function App() {
  const { isAuthenticated, role } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Clinic Routes */}
        <Route
          path="/clinic/dashboard"
          element={<ProtectedRoute element={<ClinicDashboard />} allowedRole="clinic" />}
        />
        <Route
          path="/clinic/appointments"
          element={<ProtectedRoute element={<ClinicAppointments />} allowedRole="clinic" />}
        />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={<ProtectedRoute element={<PatientAppointments />} allowedRole="patient" />}
        />
        <Route
          path="/patient/clinics"
          element={<ProtectedRoute element={<PatientClinics />} allowedRole="patient" />}
        />
        <Route
          path="/patient/appointments"
          element={<ProtectedRoute element={<PatientAppointments />} allowedRole="patient" />}
        />
        <Route
          path="/patient/profile"
          element={<ProtectedRoute element={<PatientProfile />} allowedRole="patient" />}
        />

        {/* Redirect based on role when accessing root after login */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && role === 'clinic' ? (
              <Navigate to="/clinic/dashboard" replace />
            ) : isAuthenticated && role === 'patient' ? (
              <Navigate to="/patient/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
