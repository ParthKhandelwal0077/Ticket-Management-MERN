import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTicketQuery, useAddCommentMutation } from './ticketsApiSlice';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SingleTicket = () => {
  const { ticketId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [newComment, setNewComment] = useState('');
  
  const { data: ticket, isLoading, isError, error } = useGetTicketQuery(ticketId);
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({ ticketId, content: newComment.trim() }).unwrap();
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.data?.message || 'Error loading ticket'} />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back to Dashboard Link */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Dashboard
      </Link>

      {/* Ticket Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
              ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'}`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
          </div>
          <div>
            <p><strong>Created by:</strong> {ticket.creator?.name}</p>
            <p><strong>Created at:</strong> {format(new Date(ticket.createdAt), 'PPp')}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Attachments Section */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Attachments</h2>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {attachment.filename}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              type="submit"
              disabled={isCommenting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isCommenting ? 'Adding Comment...' : 'Add Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {ticket.comments && ticket.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{comment.user?.name}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.createdAt), 'PPp')}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {(!ticket.comments || ticket.comments.length === 0) && (
              <p className="text-gray-500 text-center">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTicket; 