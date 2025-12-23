import { useState, useEffect } from 'react';
import DataTable from '../ui/DataTable';
import Layout from '../layout/Layout';
import Modal from '../ui/Modal';
import { api } from '../../services/api';

const Orders = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'date_desc' // date_desc, date_asc, amount_high, amount_low, store_asc
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ open: false, mode: 'view', data: null });
  const [formData, setFormData] = useState({
    storeName: '',
    customerName: '',
    amount: '',
    status: 'Pending',
    items: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      const formatted = data.map(o => ({
        ...o,
        order_id: o.id, // Display ID
        store: o.storeName,
        customer: o.customerName,
        // amount is number in data, keeping it as is for sorting
        amount: `₹${o.amount}`,
        rawAmount: o.amount,
        date: new Date(o.date).toLocaleDateString(),
        rawDate: o.date
      }));
      setOrders(formatted);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewOrder = () => {
    setFormData({
      storeName: '',
      customerName: '',
      amount: '',
      status: 'Pending',
      items: ''
    });
    setModalState({ open: true, mode: 'add', data: null });
  };

  const handleRowAction = async (action, row) => {
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this order?')) {
        await api.deleteOrder(row.id);
        // Refresh local state without full reload
        setOrders(prev => prev.filter(o => o.id !== row.id));
      }
    } else if (action === 'view') {
        setModalState({ open: true, mode: 'view', data: row });
    } else if (action === 'edit') {
        setFormData({
            storeName: row.store,
            customerName: row.customer,
            amount: row.rawAmount,
            status: row.status,
            items: row.items ? row.items.join(', ') : ''
        });
        setModalState({ open: true, mode: 'edit', data: row });
    }
  };

  const handleModalClose = () => {
    setModalState({ ...modalState, open: false });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const orderData = {
            storeName: formData.storeName,
            customerName: formData.customerName,
            amount: parseFloat(formData.amount),
            status: formData.status,
            items: formData.items.split(',').map(i => i.trim()).filter(i => i)
        };

        if (modalState.mode === 'add') {
            await api.addOrder(orderData);
        } else if (modalState.mode === 'edit') {
            await api.updateOrder(modalState.data.id, orderData);
        }
        
        await fetchOrders();
        handleModalClose();
    } catch (error) {
        console.error("Failed to save order", error);
        alert("Failed to save order");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer?.toLowerCase().includes(searchLower) ||
        order.store?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
        case 'date_desc':
            return new Date(b.rawDate) - new Date(a.rawDate);
        case 'date_asc':
            return new Date(a.rawDate) - new Date(b.rawDate);
        case 'amount_high':
            return b.rawAmount - a.rawAmount;
        case 'amount_low':
            return a.rawAmount - b.rawAmount;
        case 'store_asc':
            return a.store.localeCompare(b.store);
        default:
            return 0;
    }
  });

  const columns = ['Order ID', 'Store', 'Customer', 'Amount', 'Status', 'Date', 'Actions'];

  const filterOptions = [
    {
      name: 'status',
      type: 'select',
      value: filters.status,
      options: [
        { value: '', label: 'All Status' },
        { value: 'Delivered', label: 'Delivered' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'In Preparation', label: 'In Preparation' }
      ]
    },
    {
      name: 'sortBy',
      type: 'select',
      value: filters.sortBy,
      options: [
        { value: 'date_desc', label: 'Newest First' },
        { value: 'date_asc', label: 'Oldest First' },
        { value: 'amount_high', label: 'Amount: High to Low' },
        { value: 'amount_low', label: 'Amount: Low to High' },
        { value: 'store_asc', label: 'Store Name (A-Z)' }
      ]
    },
    {
      name: 'search',
      type: 'text',
      placeholder: 'Search orders...',
      value: filters.search
    }
  ];

  const modalFooter = modalState.mode !== 'view' ? (
      <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            onClick={handleModalClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
              Cancel
          </button>
          <button 
            type="submit" 
            form="orderForm"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
              {modalState.mode === 'add' ? 'Create Order' : 'Save Changes'}
          </button>
      </div>
  ) : (
    <div className="flex justify-end">
        <button 
          onClick={handleModalClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
            Close
        </button>
    </div>
  );

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <i className="fas fa-circle-notch fa-spin text-4xl text-green-600"></i>
        </div>
      ) : (
        <>
            <DataTable 
                title="Order Management"
                columns={columns}
                data={filteredOrders}
                filters={filterOptions}
                onFilterChange={handleFilterChange}
                onAddNew={handleAddNewOrder}
                onRowAction={handleRowAction}
            />

            <Modal
                isOpen={modalState.open}
                onClose={handleModalClose}
                title={
                    modalState.mode === 'add' ? 'Add New Order' : 
                    modalState.mode === 'edit' ? 'Edit Order' : 'Order Details'
                }
                footer={modalFooter}
            >
                {modalState.mode === 'view' ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.date}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Store</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.store}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Customer</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.customer}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.amount}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                    modalState.data?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    modalState.data?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {modalState.data?.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Items</label>
                            <ul className="mt-1 text-sm text-gray-900 dark:text-white list-disc list-inside">
                                {modalState.data?.items && modalState.data.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <form id="orderForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                id="storeName"
                                required
                                value={formData.storeName}
                                onChange={handleFormChange}
                                className="mt-1 input block w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                id="customerName"
                                required
                                value={formData.customerName}
                                onChange={handleFormChange}
                                className="mt-1 input block w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                required
                                min="0"
                                value={formData.amount}
                                onChange={handleFormChange}
                                className="mt-1 input block w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                className="mt-1 input block w-full"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Preparation">In Preparation</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="items" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Items (comma separated)</label>
                            <textarea
                                name="items"
                                id="items"
                                rows="3"
                                value={formData.items}
                                onChange={handleFormChange}
                                className="mt-1 input block w-full"
                                placeholder="e.g. Rice 5kg, Sugar 1kg"
                            ></textarea>
                        </div>
                    </form>
                )}
            </Modal>
        </>
      )}
    </Layout>
  );
};

export default Orders;