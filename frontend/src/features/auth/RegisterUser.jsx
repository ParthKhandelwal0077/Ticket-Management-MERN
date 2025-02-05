import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from './authApiSlice'
import NavBar from '../../components/NavBar'

const RegisterUser = () => {
  const navigate = useNavigate()
  const [register, { isLoading, isSuccess, isError, error }] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/loginUser')
    }
  }, [isSuccess, navigate])

  const validateForm = () => {
    const newErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Phone number validation (optional)
    if (formData.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Prepare registration data
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
        
        // Add phone number only if provided
        if (formData.phoneNumber) {
          registrationData.phoneNumber = formData.phoneNumber
        }

        // Call the register mutation
        await register(registrationData).unwrap()
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          submit: err.data?.message || 'Registration failed'
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <NavBar />
      <div className="flex-1 flex justify-center items-center px-4 py-16">
        <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>
          
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
                placeholder="Enter your full name"
                disabled={isLoading}
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
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                Confirm Password*
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
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
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
              {errors.phoneNumber && <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-tertiary text-white py-2 px-4 rounded-md hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Error Messages */}
            {isError && (
              <p className="mt-4 text-center text-red-500 text-sm">
                {error?.data?.message || 'Registration failed'}
              </p>
            )}
            {errors.submit && (
              <p className="mt-4 text-center text-red-500 text-sm">{errors.submit}</p>
            )}

            {/* Login Link */}
            <p className="text-center text-white text-sm mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-red-500 hover:text-red-400 focus:outline-none"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser
