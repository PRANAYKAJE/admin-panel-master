import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import StoreCard from '../ui/StoreCard';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const Stores = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Data State
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null); // Includes orders
  
  // Forms State
  const [newStore, setNewStore] = useState({ name: '', owner: '', location: '', email: '' });
  const [newOrder, setNewOrder] = useState({ amount: '', customerName: '', items: '' });

  const fetchStores = async () => {
    setLoading(true);
    try {
        const data = await api.getStores();
        const formatted = data.map(s => ({
            ...s,
            location: s.location || 'Mumbai, India',
            acceptanceRate: '95%',
            avgPrepTime: '15 min',
            status: s.status || 'Active'
        }));
        setStores(formatted);
    } catch (e) {
        console.error(e);
        toast.error("Failed to load stores");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- Add Store ---
  const handleAddNewStore = () => {
    setNewStore({ name: '', owner: '', location: '', email: '' });
    setShowAddStoreModal(true);
  };

  const saveNewStore = async (e) => {
    e.preventDefault();
    try {
      await api.addStore(newStore);
      toast.success("Store added successfully!");
      setShowAddStoreModal(false);
      fetchStores();
    } catch (error) {
      toast.error("Failed to add store");
    }
  };

  // --- View Details ---
  const handleViewStore = async (store) => {
    setSelectedStore(store);
    setShowDetailsModal(true);
    try {
      const details = await api.getStoreDetails(store.id);
      setStoreDetails(details);
    } catch (error) {
      toast.error("Failed to load store details");
    }
  };

  // --- Add Order ---
  const handleAddOrder = (store) => {
    setSelectedStore(store);
    setNewOrder({ amount: '', customerName: '', items: '' });
    setShowAddOrderModal(true);
  };

  const saveNewOrder = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;
    try {
      const orderData = {
        storeName: selectedStore.name,
        amount: parseFloat(newOrder.amount),
        customerName: newOrder.customerName,
        status: 'Pending',
        items: newOrder.items.split(',').map(i => i.trim())
      };
      await api.addOrder(orderData);
      toast.success(`Order added to ${selectedStore.name}`);
      setShowAddOrderModal(false);
      // If we are in details view, refresh details
      if (showDetailsModal && selectedStore.id) {
          const details = await api.getStoreDetails(selectedStore.id);
          setStoreDetails(details);
      }
    } catch (error) {
      toast.error("Failed to add order");
    }
  };


  const filteredStores = stores.filter(store => {
      if (filters.status && store.status !== filters.status) return false;
      if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
              store.name.toLowerCase().includes(searchLower) ||
              store.owner.toLowerCase().includes(searchLower)
          );
      }
      return true;
  });

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
        <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Management</h1>
             <button onClick={handleAddNewStore} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i> Add New Store
             </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            {filterOptions.map((filter) => (
              <div key={filter.name} className="w-full md:w-auto">
                {filter.type === 'select' ? (
                  <select
                    className="input w-full"
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
                    className="input w-full md:w-64"
                    placeholder={filter.placeholder}
                    value={filter.value}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  />
                )}
              </div>
            ))}
        </div>

        {loading ? (
           <div className="flex justify-center py-10"><i className="fas fa-spinner fa-spin text-3xl text-green-600"></i></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
                <StoreCard 
                    key={store.id} 
                    store={store} 
                    onView={handleViewStore}
                    onAddOrder={handleAddOrder}
                />
            ))}
            </div>
        )}

        {/* --- MODALS --- */}

        {/* Add Store Modal */}
        {showAddStoreModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Store</h3>
                        <button onClick={() => setShowAddStoreModal(false)} className="text-gray-500 hover:text-gray-700"><i className="fas fa-times"></i></button>
                    </div>
                    <form onSubmit={saveNewStore} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Store Name</label>
                            <input type="text" className="input w-full" required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Owner Name</label>
                            <input type="text" className="input w-full" required value={newStore.owner} onChange={e => setNewStore({...newStore, owner: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
                            <input type="text" className="input w-full" value={newStore.location} onChange={e => setNewStore({...newStore, location: e.target.value})} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={() => setShowAddStoreModal(false)} className="btn btn-outline mr-2">Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Store</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Add Order Modal */}
        {showAddOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Order for {selectedStore?.name}</h3>
                        <button onClick={() => setShowAddOrderModal(false)} className="text-gray-500 hover:text-gray-700"><i className="fas fa-times"></i></button>
                    </div>
                    <form onSubmit={saveNewOrder} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Customer Name</label>
                            <input type="text" className="input w-full" required value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
                            <input type="number" className="input w-full" required value={newOrder.amount} onChange={e => setNewOrder({...newOrder, amount: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Items (comma separated)</label>
                            <input type="text" className="input w-full" placeholder="Rice, Sugar, Oil" value={newOrder.items} onChange={e => setNewOrder({...newOrder, items: e.target.value})} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={() => setShowAddOrderModal(false)} className="btn btn-outline mr-2">Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Order</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Store Details Modal (Overlay) */}
        {showDetailsModal && selectedStore && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <div>
                             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.name}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedStore.id}</p>
                        </div>
                        <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700"><i className="fas fa-times text-xl"></i></button>
                    </div>
                    
                    <div className="p-6">
                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                             <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
                                <p className="text-sm text-blue-600 dark:text-blue-400">Total Sales</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedStore.totalSales?.toLocaleString()}</p>
                             </div>
                             <div className="card p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900">
                                <p className="text-sm text-green-600 dark:text-green-400">Rating</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.rating} / 5.0</p>
                             </div>
                             <div className="card p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900">
                                <p className="text-sm text-purple-600 dark:text-purple-400">Orders</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{storeDetails?.orders?.length || 0}</p>
                             </div>
                        </div>

                        {/* Store Info */}
                         <div className="mb-8">
                            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Store Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium text-gray-500">Owner:</span> <span className="text-gray-900 dark:text-white">{selectedStore.owner}</span></div>
                                <div><span className="font-medium text-gray-500">Location:</span> <span className="text-gray-900 dark:text-white">{selectedStore.location}</span></div>
                                <div><span className="font-medium text-gray-500">Joined:</span> <span className="text-gray-900 dark:text-white">{selectedStore.joinedDate}</span></div>
                                <div><span className="font-medium text-gray-500">Status:</span> <span className="text-gray-900 dark:text-white">{selectedStore.status}</span></div>
                            </div>
                        </div>

                        {/* Store Orders Table */}
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h4>
                                <button onClick={() => handleAddOrder(selectedStore)} className="btn btn-sm btn-primary">
                                    <i className="fas fa-plus mr-1"></i> New Order
                                </button>
                             </div>
                             
                             {!storeDetails ? (
                                 <div className="text-center py-4"><i className="fas fa-spinner fa-spin"></i> Loading details...</div>
                             ) : (
                                 <div className="overflow-x-auto">
                                     <table className="table w-full text-left">
                                         <thead>
                                             <tr className="border-b dark:border-gray-700">
                                                 <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                                                 <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                                                 <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                                 <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                             </tr>
                                         </thead>
                                         <tbody>
                                             {storeDetails.orders && storeDetails.orders.length > 0 ? (
                                                 storeDetails.orders.map(order => (
                                                     <tr key={order.id} className="border-b dark:border-gray-700">
                                                         <td className="p-3 text-sm dark:text-gray-300">{order.id}</td>
                                                         <td className="p-3 text-sm dark:text-gray-300">{order.customerName}</td>
                                                         <td className="p-3 text-sm dark:text-gray-300">₹{order.amount}</td>
                                                         <td className="p-3 text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                         </td>
                                                     </tr>
                                                 ))
                                             ) : (
                                                 <tr>
                                                     <td colSpan="4" className="p-4 text-center text-gray-500">No orders found for this store.</td>
                                                 </tr>
                                             )}
                                         </tbody>
                                     </table>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
             </div>
        )}
      </div>
    </Layout>
  );
};

export default Stores;