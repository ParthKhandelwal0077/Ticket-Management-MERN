import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './components/Welcome'
import Login from './features/auth/LoginUser'
import Register from './features/auth/RegisterUser'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import Dashboard from './components/Dashboard/Dashboard'
import Profile from './features/user/Profile'
import Ticket from './features/tickets/Ticket'
import EditProfile from './features/user/EditProfile'

// Define roles for route protection
const ROLES = {
  User: 'user',
  Agent: 'agent',
  Admin: 'admin'
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="auth">
          <Route path="loginUser" element={<Login />} />
          <Route path="registerUser" element={<Register />} />
        </Route>

        {/* Protected Routes */}
    
      <Route element={<PersistLogin />}>
          <Route path='/' element={<Layout />}>
          {/* User Routes - accessible by all authenticated users */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Agent, ROLES.Admin]} />}>
          <Route path="dashboard" element={<Dashboard/ >}/>
            <Route path="profile" element={<Profile />} />
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="tickets/:ticketId" element={<Ticket />} />
          </Route>

          {/* Agent Routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Agent, ROLES.Admin]} />}>
            <Route path="tickets">
              <Route path="assigned" element={<Dashboard />} />
              <Route path="all" element={<Dashboard />} />
            </Route>
            <Route path="articles">
              <Route path="manage" element={<Dashboard />} />
              <Route path="create" element={<Dashboard />} />
              <Route path="edit/:id" element={<Dashboard />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin">
              <Route path="users" element={<Dashboard />} />
              <Route path="tickets/escalated" element={<Dashboard />} />
              <Route path="system" element={<Dashboard />} />
            </Route>
          </Route>
          </Route>
          </Route>
        </Route>
   
        {/* Catch all - 404 */}

   
    </Routes>
  )
}

export default App