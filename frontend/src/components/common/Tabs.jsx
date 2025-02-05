import PropTypes from 'prop-types';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium text-gray-600 border-b-2 transition-colors duration-300
            ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
          >
            {tab.label}
          </button>
        ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default Tabs; 