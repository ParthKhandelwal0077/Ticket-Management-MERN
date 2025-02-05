import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../features/users/usersApiSlice';
import { useGetAllTicketsQuery, useGetEscalatedTicketsQuery } from '../../features/tickets/ticketsApiSlice';
import { useGetArticlesQuery } from '../../features/articles/articlesApiSlice';
import UserList from '../Users/UserList';
import TicketList from '../Tickets/TicketList';
import ArticleList from '../Articles/ArticleList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Tabs from '../common/Tabs';
import StatsCard from '../common/StatsCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useSelector((state) => state.auth);

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMessage
  } = useGetAllUsersQuery();

  const {
    data: allTickets,
    isLoading: allTicketsLoading,
    isError: allTicketsError,
    error: allTicketsErrorMessage
  } = useGetAllTicketsQuery();

  const {
    data: escalatedTickets,
    isLoading: escalatedLoading,
    isError: escalatedError,
    error: escalatedErrorMessage
  } = useGetEscalatedTicketsQuery();

  const {
    data: articles,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articlesErrorMessage
  } = useGetArticlesQuery();

  if (usersLoading || allTicketsLoading || escalatedLoading || articlesLoading) {
    return <LoadingSpinner />;
  }

  if (usersError || allTicketsError || escalatedError || articlesError) {
    return <ErrorMessage message={usersErrorMessage || allTicketsErrorMessage || escalatedErrorMessage || articlesErrorMessage} />;
  }

  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'articles', label: 'Articles' }
  ];

  // Calculate statistics
  const stats = {
    totalUsers: users?.length || 0,
    totalAgents: users?.filter(u => u.role === 'agent').length || 0,
    totalTickets: allTickets?.length || 0,
    escalatedTickets: escalatedTickets?.length || 0,
    totalArticles: articles?.length || 0
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Users" value={stats.totalUsers} icon="users" />
          <StatsCard title="Total Agents" value={stats.totalAgents} icon="user-shield" />
          <StatsCard title="Total Tickets" value={stats.totalTickets} icon="ticket" />
          <StatsCard title="Escalated Tickets" value={stats.escalatedTickets} icon="exclamation" />
          <StatsCard title="Total Articles" value={stats.totalArticles} icon="newspaper" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-6">User Management</h3>
          <UserList users={users} showControls={true} />
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">Escalated Tickets</h3>
            <TicketList 
              tickets={escalatedTickets}
              showAssignee={true}
              showStatus={true}
              showPriority={true}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">All Tickets</h3>
            <TicketList 
              tickets={allTickets}
              showAssignee={true}
              showStatus={true}
              showPriority={true}
            />
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-6">Article Management</h3>
          <ArticleList 
            articles={articles}
            showControls={true}
            showAuthor={true}
            showStats={true}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 