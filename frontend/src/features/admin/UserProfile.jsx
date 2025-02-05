import { useParams } from 'react-router-dom';
import { useGetUserQuery } from '../../features/user/userApiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import TicketList from '../tickets/TicketList';
import { useState } from 'react';
import { useAddCommentMutation } from '../tickets/ticketsApiSlice';
import { useGetAllTicketsQuery } from '../../features/tickets/ticketsApiSlice';

const UserProfile = () => {
  const { userId } = useParams();
  const { data: user, isLoading: userLoading, isError: userError, error: userErrorMessage } = useGetUserQuery(userId);
  const { data: allTickets, isLoading: ticketsLoading, isError: ticketsError, error: ticketsErrorMessage } = useGetAllTicketsQuery();

  const [newComment, setNewComment] = useState('');
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const userTickets = allTickets?.data?.filter(ticket => ticket.creator._id === userId) || [];

  const handleAddComment = async (ticketId) => {
    if (!newComment.trim()) return;

    try {
      await addComment({ ticketId, content: newComment }).unwrap();
      setNewComment('');
      alert('Comment added successfully');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (userLoading || ticketsLoading) return <LoadingSpinner />;
  if (userError || ticketsError) return <ErrorMessage message={userErrorMessage || ticketsErrorMessage} />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">User Profile</h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold">User Information</h4>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-4">User Tickets</h4>
        {userTickets.map(ticket => (
          <div key={ticket._id} className="mb-4">
            <h5 className="text-md font-semibold">{ticket.title}</h5>
            <TicketList tickets={[ticket]} showAssignee={true} showStatus={true} showPriority={true} />
            <div className="mt-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
              <button
                onClick={() => handleAddComment(ticket._id)}
                disabled={isAddingComment || !newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isAddingComment ? 'Adding Comment...' : 'Add Comment'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile; 