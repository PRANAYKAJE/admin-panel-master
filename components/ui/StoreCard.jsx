import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const StoreCard = ({ store }) => {
  const getStatusClass = () => {
    switch (store.status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{store.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
          {store.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <i className="fas fa-user mr-2"></i>
          <span>{store.owner}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <i className="fas fa-map-marker-alt mr-2"></i>
          <span>{store.location}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Acceptance Rate</div>
          <div className="font-semibold text-gray-900 dark:text-white">{store.acceptanceRate}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Prep Time</div>
          <div className="font-semibold text-gray-900 dark:text-white">{store.avgPrepTime}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
          <div className="font-semibold text-gray-900 dark:text-white">{store.rating}</div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="btn btn-outline flex-1">
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          View
        </button>
        <button className="btn btn-primary flex-1">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Order
        </button>
      </div>
    </div>
  );
};

export default StoreCard;