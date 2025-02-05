import { Link } from 'react-router-dom'
import { useState } from 'react'

const NavBar = (location) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let userLogin = (
              <Link to="/auth/loginUser" className="text-white hover:text-gray-300 transition-colors">
              Login as User
            </Link>
  )
  let registerUser = (
    <Link to="/auth/registerUser" className="text-white hover:text-gray-300 transition-colors">
    Register as User
  </Link>
  )

  return (
    <nav className="bg-black border-b border-red-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-white"><Link to="/">AskUs</Link></h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {location.pathname === "/auth/loginUser" ? <></> : userLogin}
          
            {location.pathname === "/user/registerUser" ? <></> : registerUser}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black shadow-lg border-t border-amber-200 justify-center items-center">
            {location.pathname === "/auth/loginUser" ? <></> : userLogin}
        
            {location.pathname === "/auth/registerUser" ? <></> : registerUser}
         
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
