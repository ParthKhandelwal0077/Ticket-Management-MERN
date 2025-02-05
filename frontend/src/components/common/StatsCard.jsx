import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserShield, 
  faTicket, 
  faExclamation,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  users: faUsers,
  'user-shield': faUserShield,
  ticket: faTicket,
  exclamation: faExclamation,
  newspaper: faNewspaper
};

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="bg-blue-100 rounded-full p-3">
          <FontAwesomeIcon 
            icon={iconMap[icon]} 
            className="h-6 w-6 text-blue-600" 
          />
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.oneOf(['users', 'user-shield', 'ticket', 'exclamation', 'newspaper']).isRequired
};

export default StatsCard; 