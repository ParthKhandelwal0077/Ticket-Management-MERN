import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTicketQuery, useAddCommentMutation } from './ticketsApiSlice';

import { format, parseISO } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'PPp');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

const Ticket = () => {
  const { ticketId } = useParams();
  const [newComment, setNewComment] = useState('');
  const { user } = useSelector((state) => state.auth);

  const {
    data: ticket,
    isLoading,
    isError,
    error
  } = useGetTicketQuery(ticketId);

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message || 'Failed to load ticket'} />;
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?._id) return;

    try {
      await addComment({
        ticketId,
        content: newComment,
        userId: user._id
      }).unwrap();
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  // Early return if ticket data is not available
  if (!ticket?.data) {
    return <ErrorMessage message="Ticket data not available" />;
  }

  const ticketData = ticket.data;
  
  // Function to get user's display name
  const getDisplayName = (userData) => {
    if (!userData) return 'Unknown User';
    // If userData is just the ID, return a placeholder

    if (typeof userData === 'string') return 'Loading...';
    // If we have the full user object
    if (userData.name) return userData.name;
    // Fallback to role or unknown
    return userData.role ? `${userData.role} User` : 'Unknown User';
  };

  // Function to get user's initial
  const getUserInitial = (userData) => {
    if (!userData || typeof userData === 'string') return '?';
    return userData.name ? userData.name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Ticket Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticketData.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                Opened by {getDisplayName(ticketData.creator)} on {formatDate(ticketData.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${ticketData.status === 'open' ? 'bg-green-100 text-green-800' :
                ticketData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                ticketData.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                ticketData.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'}`}
            >
              {ticketData.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="prose max-w-none">
            <p className="text-gray-700">{ticketData.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Category:</span> {ticketData.category}
            </div>
            <div>
              <span className="font-medium">Priority:</span> {ticketData.priority}
            </div>
            {ticketData.assignedTo && (
              <div>
                <span className="font-medium">Assigned to:</span> {getDisplayName(ticketData.assignedTo)}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>
          
          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {ticketData.comments?.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {getUserInitial(comment.user)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{getDisplayName(comment.user)}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mt-6">
            <div>
              <label htmlFor="comment" className="sr-only">Add your comment</label>
              <textarea
                id="comment"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isAddingComment}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Commenting as {getDisplayName(user)}
              </p>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isAddingComment || !newComment.trim()}
              >
                {isAddingComment ? 'Adding Comment...' : 'Add Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
