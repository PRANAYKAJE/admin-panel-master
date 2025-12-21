import { useState } from 'react';
import Layout from '../layout/Layout';
import StoreCard from '../ui/StoreCard';

const Stores = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Filter changed: ${name} = ${value}`);
  };

  const handleAddNewStore = () => {
    console.log('Add new store clicked');
  };

  const stores = [
    {
      id: 1,
      name: 'Fresh Mart',
      owner: 'Rajesh Kumar',
      location: 'Andheri, Mumbai',
      acceptanceRate: '94%',
      avgPrepTime: '12 min',
      rating: '4.7/5',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Daily Needs',
      owner: 'Priya Singh',
      location: 'Bandra, Mumbai',
      acceptanceRate: '89%',
      avgPrepTime: '15 min',
      rating: '4.5/5',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Kirana Corner',
      owner: 'Amit Patel',
      location: 'Powai, Mumbai',
      acceptanceRate: '92%',
      avgPrepTime: '10 min',
      rating: '4.8/5',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Super Store',
      owner: 'Neha Sharma',
      location: 'Malad, Mumbai',
      acceptanceRate: '85%',
      avgPrepTime: '18 min',
      rating: '4.3/5',
      status: 'Active'
    },
    {
      id: 5,
      name: 'City Mart',
      owner: 'Vikram Reddy',
      location: 'Goregaon, Mumbai',
      acceptanceRate: '88%',
      avgPrepTime: '14 min',
      rating: '4.6/5',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Quick Mart',
      owner: 'Sanjay Gupta',
      location: 'Kurla, Mumbai',
      acceptanceRate: '90%',
      avgPrepTime: '13 min',
      rating: '4.4/5',
      status: 'Active'
    }
  ];

  const filterOptions = [
    {
      name: 'status',
      type: 'select',
      value: filters.status,
      options: [
        { value: '', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' }
      ]
    },
    {
      name: 'search',
      type: 'text',
      placeholder: 'Search Store Name or Owner',
      value: filters.search
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Management</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-2">
            {filterOptions.map((filter) => (
              <div key={filter.name} className="w-full md:w-auto">
                {filter.type === 'select' ? (
                  <select
                    className="input"
                    value={filter.value}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="input"
                    placeholder={filter.placeholder}
                    value={filter.value}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <button 
            className="btn btn-primary w-full md:w-auto"
            onClick={handleAddNewStore}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Store
          </button>
        </div>
        
        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Stores;