import { useState } from 'react';

import DataTable from '../ui/DataTable';
import Layout from '../layout/Layout';
const Orders = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Filter changed: ${name} = ${value}`);
  };

  const handleAddNewOrder = () => {
    console.log('Add new order clicked');
  };

  const columns = ['Order ID', 'Store', 'Customer', 'Amount', 'Status', 'Date', 'Actions'];

  const data = [
    {
      id: 'ORD-7845',
      order_id: '#ORD-7845',
      store: 'Fresh Mart',
      customer: 'Rajesh Kumar',
      amount: '₹1,245',
      status: 'New',
      date: 'Today, 10:30 AM'
    },
    {
      id: 'ORD-7844',
      order_id: '#ORD-7844',
      store: 'Daily Needs',
      customer: 'Priya Singh',
      amount: '₹856',
      status: 'In Preparation',
      date: 'Today, 10:15 AM'
    },
    {
      id: 'ORD-7843',
      order_id: '#ORD-7843',
      store: 'Kirana Corner',
      customer: 'Amit Patel',
      amount: '₹2,340',
      status: 'Out for Delivery',
      date: 'Today, 9:45 AM'
    },
    {
      id: 'ORD-7842',
      order_id: '#ORD-7842',
      store: 'Super Store',
      customer: 'Neha Sharma',
      amount: '₹1,890',
      status: 'New',
      date: 'Today, 9:30 AM'
    },
    {
      id: 'ORD-7841',
      order_id: '#ORD-7841',
      store: 'City Mart',
      customer: 'Vikram Reddy',
      amount: '₹3,120',
      status: 'Delivered',
      date: 'Today, 8:45 AM'
    },
    {
      id: 'ORD-7840',
      order_id: '#ORD-7840',
      store: 'Fresh Mart',
      customer: 'Anita Desai',
      amount: '₹2,780',
      status: 'Cancelled',
      date: 'Today, 8:30 AM'
    },
     {
      id: 'ORD-7839',
      order_id: '#ORD-7839',
      store: 'Quick Mart',
      customer: 'Sanjay Gupta',
      amount: '₹1,560',
      status: 'Delivered',
      date: 'Today, 8:15 AM'
    },
    {
      id: 'ORD-7838',
      order_id: '#ORD-7838',
      store: 'Daily Needs',
      customer: 'Meena Patel',
      amount: '₹980',
      status: 'In Preparation',
      date: 'Today, 8:00 AM'
    },
    {
      id: 'ORD-7837',
      order_id: '#ORD-7837',
      store: 'Fresh Mart',
      customer: 'Ramesh Kumar',
      amount: '₹2,120',
      status: 'Out for Delivery',
      date: 'Today, 7:45 AM'
    },
    {
      id: 'ORD-7836',
      order_id: '#ORD-7836',
      store: 'Kirana Corner',
      customer: 'Sunita Reddy',
      amount: '₹1,750',
      status: 'Delivered',
      date: 'Today, 7:30 AM'
    },
    {
      id: 'ORD-7835',
      order_id: '#ORD-7835',
      store: 'Super Store',
      customer: 'Vijay Sharma',
      amount: '₹3,450',
      status: 'New',
      date: 'Today, 7:15 AM'
    },
    {
      id: 'ORD-7834',
      order_id: '#ORD-7834',
      store: 'City Mart',
      customer: 'Anita Desai',
      amount: '₹2,890',
      status: 'Cancelled',
      date: 'Today, 7:00 AM'
    }
  ];

  const filterOptions = [
    {
      name: 'status',
      type: 'select',
      value: filters.status,
      options: [
        { value: '', label: 'All Status' },
        { value: 'New', label: 'New' },
        { value: 'Accepted', label: 'Accepted' },
        { value: 'In Preparation', label: 'In Preparation' },
        { value: 'Out for Delivery', label: 'Out for Delivery' },
        { value: 'Delivered', label: 'Delivered' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    },
    {
      name: 'startDate',
      type: 'date',
      value: filters.startDate
    },
    {
      name: 'endDate',
      type: 'date',
      value: filters.endDate
    },
    {
      name: 'search',
      type: 'text',
      placeholder: 'Search Order ID or Store',
      value: filters.search
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
        <DataTable 
          title="Order List"
          columns={columns}
          data={data}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onAddNew={handleAddNewOrder}
        />
      </div>
    </Layout>
  );
};

export default Orders;