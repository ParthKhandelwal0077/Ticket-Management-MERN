import { useSelector } from 'react-redux';
import UserDashboard from './UserDashboard';
// import AgentDashboard from './AgentDashboard';
// import AdminDashboard from './AdminDashboard';
import PulseLoader from 'react-spinners/PulseLoader';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-primary">
        <PulseLoader color={"#FFF"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Render dashboard based on user role */}
      
      {user.role === 'user' && <UserDashboard />}
      {/* {user.role === 'agent' && <AgentDashboard />} */}
      {/* {user.role === 'admin' && <AdminDashboard />} */}
    </div>
  );
};

export default Dashboard; 