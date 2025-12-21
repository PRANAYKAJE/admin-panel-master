const KpiCard = ({ title, value, change, changeType, icon, iconType }) => {
  const getIconColor = () => {
    switch (iconType) {
      case 'primary': return 'text-green-600 dark:text-green-400';
      case 'success': return 'text-green-500 dark:text-green-400';
      case 'warning': return 'text-yellow-500 dark:text-yellow-400';
      case 'danger': return 'text-red-500 dark:text-red-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  const getChangeColor = () => {
    return changeType === 'positive' ? 'text-green-500' : 'text-red-500';
  };

  const getChangeIcon = () => {
    return changeType === 'positive' ? 'fa-arrow-up' : 'fa-arrow-down';
  };

  return (
    <div className="card p-5 flex items-center space-x-5">
      <div className={`w-12 h-12 mb-12 rounded-lg flex items-center justify-center ${
        iconType === 'primary' ? 'bg-green-100 dark:bg-green-900' : 
        iconType === 'success' ? 'bg-green-100 dark:bg-green-900' : 
        iconType === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' : 
        'bg-red-100 dark:bg-red-900'
      }`}>
        <i className={`fas fa-${icon} text-xl ${getIconColor()}`}></i>
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
        <div className={`flex items-center mt-1 text-sm font-medium ${getChangeColor()}`}>
          <i className={`fas ${getChangeIcon()} mr-1`}></i>
          {change}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;