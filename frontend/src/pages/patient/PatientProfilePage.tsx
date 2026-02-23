import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { userService, UpdateProfileDto } from '../../services/user.service'

export default function PatientProfilePage() {
    const { user, logout } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState<UpdateProfileDto>({
        fullName: '',
        idNumber: '',
        dateOfBirth: '',
        phone: '',
        address: '',
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const data = await userService.getProfile()
            setProfile(data)
            setFormData({
                fullName: data.fullName || '',
                idNumber: data.idNumber || '',
                dateOfBirth: data.dateOfBirth || '',
                phone: data.phone || '',
                address: data.address || '',
            })
        } catch (error) {
            console.error('Failed to fetch profile:', error)
            alert('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await userService.updateProfile(formData)
            alert('Profile updated successfully!')
            setIsEditing(false)
            await fetchProfile()
        } catch (error: any) {
            console.error('Failed to update profile:', error)
            alert(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset form data to current profile
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                idNumber: profile.idNumber || '',
                dateOfBirth: profile.dateOfBirth || '',
                phone: profile.phone || '',
                address: profile.address || '',
            })
        }
    }

    const profileCompletion = profile ? (
        [profile.fullName, profile.idNumber, profile.dateOfBirth, profile.phone, profile.address]
            .filter(Boolean).length / 5 * 100
    ) : 0

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
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading profile...</div>
                    ) : (
                        <>
                            {/* Profile Completion */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                                    <span className="text-sm font-medium text-gray-700">{Math.round(profileCompletion)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${profileCompletion}%` }}
                                    />
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profile?.email || ''}
                                        disabled
                                        className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                                    <input
                                        type="text"
                                        value={formData.idNumber}
                                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        disabled={!isEditing}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
