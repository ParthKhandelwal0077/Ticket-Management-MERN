import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserTicketsQuery } from '../../features/tickets/ticketsApiSlice';
import { useGetArticlesQuery } from '../../features/articles/articlesApiSlice';
import TicketList from '../../features/tickets/TicketList';
import ArticleList from '../../features/articles/ArticleList';
import CreateTicketForm from '../../features/tickets/CreateTicketForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const UserDashboard = () => {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  const {
    data: tickets,
    isLoading: ticketsLoading,
    isError: ticketsError,
    error: ticketsErrorMessage
  } = useGetUserTicketsQuery('ticketsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  const {
    data: articles,
    isLoading: articlesLoading,
    isError: articlesError,
    error: articlesErrorMessage
  } = useGetArticlesQuery();

  if (ticketsLoading || articlesLoading) {
    return <LoadingSpinner />;
  }

  if (ticketsError || articlesError) {
    return <ErrorMessage message={ticketsErrorMessage || articlesErrorMessage} />;
  }

  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600">Here&apos;s an overview of your tickets and available articles.</p>
      </div>

      {/* Tickets Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">My Tickets</h3>
          <button
            onClick={() => setShowCreateTicket(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Ticket
          </button>
        </div>

        {showCreateTicket && (
          <div className="mb-6">
            <CreateTicketForm onClose={() => setShowCreateTicket(false)} />
          </div>
        )}

        <TicketList tickets={tickets?.data || []} />
      </div>

      {/* Articles Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-6">Articles</h3>
        <ArticleList 
          articles={articles?.data || []} 
          showInteractions={true}
          showAuthor={true}
        />
      </div>
    </div>
  );
};

export default UserDashboard; 