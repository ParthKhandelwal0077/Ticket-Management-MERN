import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetProfileQuery, useUpdateProfileMutation } from './userApiSlice'
import HomeHeader from '../../components/HomeHeader'

const EditProfile = () => {
  const navigate = useNavigate()
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (profile?.data) {
      setFormData(prev => ({
        ...prev,
        name: profile.data.name || '',
        email: profile.data.email || '',
        phoneNumber: profile.data.phoneNumber || ''
      }))
    }
  }, [profile])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    // Only validate password fields if any password field is filled
    if (formData.newPassword || formData.currentPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password'
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters'
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Only include fields that have values
        const updateData = {
          name: formData.name,
          email: formData.email
        }

        if (formData.phoneNumber) {
          updateData.phoneNumber = formData.phoneNumber
        }

        if (formData.newPassword && formData.currentPassword) {
          updateData.currentPassword = formData.currentPassword
          updateData.newPassword = formData.newPassword
        }

        await updateProfile(updateData).unwrap()
        setSuccessMessage('Profile updated successfully')
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }))
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          submit: err.data?.message || 'Failed to update profile'
        }))
      }
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-primary">
        <HomeHeader />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-800"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <HomeHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-secondary rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Back to Profile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                Full Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                disabled={isUpdating}
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                disabled={isUpdating}
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-white text-sm font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                disabled={isUpdating}
              />
              {errors.phoneNumber && <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Password Change Section */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-white text-lg font-medium mb-4">Change Password</h3>

              {/* Current Password */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-white text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                    disabled={isUpdating}
                  />
                  {errors.currentPassword && <p className="mt-1 text-red-500 text-sm">{errors.currentPassword}</p>}
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-white text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                    disabled={isUpdating}
                  />
                  {errors.newPassword && <p className="mt-1 text-red-500 text-sm">{errors.newPassword}</p>}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-white text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                    disabled={isUpdating}
                  />
                  {errors.confirmNewPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmNewPassword}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-tertiary text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <p className="text-green-500 text-sm text-center mt-4">{successMessage}</p>
            )}

            {/* Error Message */}
            {errors.submit && (
              <p className="text-red-500 text-sm text-center mt-4">{errors.submit}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
