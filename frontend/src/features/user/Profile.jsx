import { useNavigate } from 'react-router-dom'
import { useGetProfileQuery } from './userApiSlice'


const Profile = () => {
  const navigate = useNavigate()
  const { data: profile, isLoading, isError, error } = useGetProfileQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-800"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-primary">

        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="text-white text-center">
            <p className="text-xl">Error loading profile</p>
            <p className="text-sm text-gray-400">{error?.data?.message || 'Please try again later'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-secondary rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <button
              onClick={() => navigate('/editProfile')}
              className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-900 transition-colors"
            >
              Edit Profile
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white text-lg">{profile?.data?.name}</p>
            </div>

            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white text-lg">{profile?.data?.email}</p>
            </div>

            {profile?.data?.phoneNumber && (
              <div className="border-b border-gray-700 pb-4">
                <p className="text-gray-400 text-sm">Phone Number</p>
                <p className="text-white text-lg">{profile?.data?.phoneNumber}</p>
              </div>
            )}

            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-400 text-sm">Account Type</p>
              <p className="text-white text-lg capitalize">{profile?.data?.role}</p>
            </div>

            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-white text-lg">
                {new Date(profile?.data?.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-400 text-sm">Last Login</p>
              <p className="text-white text-lg">
                {profile?.data?.lastLogin 
                  ? new Date(profile.data.lastLogin).toLocaleString()
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
