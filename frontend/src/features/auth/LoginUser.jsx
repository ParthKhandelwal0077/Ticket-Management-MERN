import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import NavBar from '../../components/NavBar'
import usePersist from '../../hooks/usePersist'

const LoginUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const [login, { isLoading }] = useLoginMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleToggle = () => setPersist(prev => !prev)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = await login(formData).unwrap()
      dispatch(setCredentials(userData.data))
      setFormData({ email: '', password: '' })
      navigate('/dashboard')
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg('Missing Email or Password')
      } else if (err.status === 401) {
        setErrMsg('Invalid Email or Password')
      } else {
        setErrMsg(err.data?.message || 'Login Failed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <NavBar />
      <div className="flex-1 flex justify-center items-center px-4 py-16">
        <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-8">User Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
                className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-700 rounded bg-gray-900"
              />
              <label htmlFor="persist" className="ml-2 block text-sm text-white">
                Trust This Device
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-tertiary text-white py-2 px-4 rounded-md hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-red-800 hover:text-red-600 text-sm font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {errMsg && (
              <p className="mt-4 text-center text-red-500 text-sm">{errMsg}</p>
            )}

            {/* Register Link */}
            <p className="text-center text-white text-sm mt-4">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-red-500 hover:text-red-400 focus:outline-none"
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginUser
