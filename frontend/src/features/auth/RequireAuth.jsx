import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth/loginUser" state={{ from: location }} replace />;
  }

  // If user's role is not in the allowed roles, redirect to dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If user is authenticated and authorized, render the protected route
  return <Outlet />;
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RequireAuth; 