import { useState } from 'react';
import Layout from '../layout/Layout';
import DataTable from '../ui/DataTable';

const DeliveryPartners = () => {
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

  const handleAddNewPartner = () => {
    console.log('Add new partner clicked');
  };

  const columns = ['Partner ID', 'Name', 'Phone', 'Vehicle', 'Status', 'Rating', 'Orders', 'Actions'];

  const data = [
    {
      id: 'DP-1001',
      partner_id: '#DP-1001',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      vehicle: 'Bike',
      status: 'Active',
      rating: '4.8/5',
      orders: '248'
    },
    {
      id: 'DP-1002',
      partner_id: '#DP-1002',
      name: 'Amit Patel',
      phone: '+91 87654 32109',
      vehicle: 'Scooter',
      status: 'Active',
      rating: '4.5/5',
      orders: '196'
    },
    {
      id: 'DP-1003',
      partner_id: '#DP-1003',
      name: 'Vikram Singh',
      phone: '+91 76543 21098',
      vehicle: 'Bike',
      status: 'On Leave',
      rating: '4.7/5',
      orders: '312'
    },
    {
      id: 'DP-1004',
      partner_id: '#DP-1004',
      name: 'Sanjay Kumar',
      phone: '+91 65432 10987',
      vehicle: 'Cycle',
      status: 'Active',
      rating: '4.2/5',
      orders: '87'
    },
    {
      id: 'DP-1005',
      partner_id: '#DP-1005',
      name: 'Rajesh Verma',
      phone: '+91 54321 09876',
      vehicle: 'Bike',
      status: 'Suspended',
      rating: '3.5/5',
      orders: '156'
    },
    {
      id: 'DP-1006',
      partner_id: '#DP-1006',
      name: 'Sunil Reddy',
      phone: '+91 43210 98765',
      vehicle: 'Scooter',
      status: 'Active',
      rating: '4.6/5',
      orders: '223'
    },
    {
      id: 'DP-1007',
      partner_id: '#DP-1007',
      name: 'Manish Gupta',
      phone: '+91 32109 87654',
      vehicle: 'Bike',
      status: 'Active',
      rating: '4.4/5',
      orders: '187'
    },
    {
      id: 'DP-1008',
      partner_id: '#DP-1008',
      name: 'Anil Desai',
      phone: '+91 21098 76543',
      vehicle: 'Cycle',
      status: 'On Leave',
      rating: '4.3/5',
      orders: '94'
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
        { value: 'On Leave', label: 'On Leave' },
        { value: 'Suspended', label: 'Suspended' }
      ]
    },
    {
      name: 'search',
      type: 'text',
      placeholder: 'Search Partner ID or Name',
      value: filters.search
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Partner Management</h1>

        {/* Partner Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">42</div>
            <div className="text-gray-500 dark:text-gray-400">Total Partners</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">36</div>
            <div className="text-gray-500 dark:text-gray-400">Active Partners</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">4</div>
            <div className="text-gray-500 dark:text-gray-400">On Leave</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">2</div>
            <div className="text-gray-500 dark:text-gray-400">Suspended</div>
          </div>
        </div>

        {/* Partner Map */}
        <div className="card p-6 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl">
          <div className="text-center">
            <i className="fas fa-map-marked-alt text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400">Live Partner Tracking Map</p>
          </div>
        </div>

        {/* Partners Table */}
        <DataTable 
          title="Partner List"
          columns={columns}
          data={data}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onAddNew={handleAddNewPartner}
        />
      </div>
    </Layout>
  );
};

export default DeliveryPartners;