import { useState } from 'react';
import { useSelector } from 'react-redux';
import UserManagement from '../../features/admin/UserManagement';
import TicketManagement from '../../features/admin/TicketManagement';
import AgentManagement from '../../features/admin/AgentManagement';
import EscalatedTickets from '../../features/admin/EscalatedTickets';
import Tabs from '../../components/common/Tabs';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useSelector((state) => state.auth);

  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'tickets', label: 'Ticket Management' },
    { id: 'agents', label: 'Agent Management' },
    { id: 'escalated', label: 'Escalated Tickets' }
  ];

  return (
    <div className="space-y-8">
      {/* Admin Info Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Welcome, Admin {user.name}!</h2>
        <p className="text-gray-600">System overview and management dashboard.</p>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={dashboardTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-6">Overview</h3>
          <p className="text-gray-600">Welcome to the admin dashboard. Use the tabs to navigate through different management sections.</p>
        </div>
      )}

      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'tickets' && <TicketManagement />}
      {activeTab === 'agents' && <AgentManagement />}
      {activeTab === 'escalated' && <EscalatedTickets />}
    </div>
  );
};

export default AdminDashboard; 