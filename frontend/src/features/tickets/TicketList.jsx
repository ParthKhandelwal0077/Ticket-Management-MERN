import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format, isValid, parseISO } from 'date-fns';

const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'PPp') : 'Invalid date';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

const TicketList = ({ tickets, showAssignee = false, showStatus = true, showPriority = false }) => {
  if (!Array.isArray(tickets) || !tickets?.length) {
    return <p className="text-gray-500 text-center py-4">No tickets found</p>;
  }

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <Link
          key={ticket._id}
          to={`/dashboard/tickets/${ticket._id}`}
          className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
            {showStatus && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                  ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'}`}
              >
                {ticket.status}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600 line-clamp-2">{ticket.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Category:</span> {ticket.category}
            </div>
            {showPriority && (
              <div>
                <span className="font-medium">Priority:</span> {ticket.priority}
              </div>
            )}
            {showAssignee && ticket.assignedTo && (
              <div>
                <span className="font-medium">Assigned to:</span> {ticket.assignedTo.name}
              </div>
            )}
            <div>
              <span className="font-medium">Created:</span> {formatDate(ticket.createdAt)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string,
    assignedTo: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired
  })).isRequired,
  showAssignee: PropTypes.bool,
  showStatus: PropTypes.bool,
  showPriority: PropTypes.bool
};

export default TicketList; 