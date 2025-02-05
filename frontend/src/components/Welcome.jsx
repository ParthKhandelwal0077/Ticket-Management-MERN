import NavBar from './NavBar'
import { Link, Outlet } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className="min-h-screen bg-primary">
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] space-y-6 px-4">
        <h1 className="text-4xl font-bold text-white">Welcome <span className="text-red-800">to</span> AskUs</h1>
        <p className="text-lg text-white text-center max-w-2xl">
          AskUs is a platform for users to raise queries and get instant solutions from our agents.
        </p>
        <div className="flex justify-center items-center space-x-4 bg-gray-500 rounded-lg p-2">
          <Link to="/auth/loginUser" className="text-white hover:text-red-300 transition-opacity">Login as User</Link>
          <span className="text-red-800">|</span>
          <Link to="/auth/registerUser" className="text-white hover:text-red-300 transition-opacity">Register as User</Link>
        </div>
      </div>
      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  )
}

export default Welcome
