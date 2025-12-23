import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const DeliveryPartners = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ open: false, mode: 'view', data: null });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: 'Bike',
    status: 'Offline',
    email: ''
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await api.getPartners();
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners", error);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewPartner = () => {
    setFormData({ name: '', phone: '', vehicle: 'Bike', status: 'Offline', email: '' });
    setModalState({ open: true, mode: 'add', data: null });
  };

  const handleRowAction = async (action, row) => {
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this partner?')) {
        await api.deletePartner(row.id);
        setPartners(prev => prev.filter(p => p.id !== row.id));
        toast.success("Partner deleted successfully");
      }
    } else if (action === 'view') {
        setModalState({ open: true, mode: 'view', data: row });
    } else if (action === 'edit') {
        // Find full partner object from state to get all fields
        const fullPartner = partners.find(p => p.id === row.id) || row;
        setFormData({
            name: fullPartner.name,
            phone: fullPartner.phone,
            vehicle: fullPartner.vehicle || 'Bike',
            status: fullPartner.status,
            email: fullPartner.email || ''
        });
        setModalState({ open: true, mode: 'edit', data: fullPartner });
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
    if (!formData.name || !formData.phone) {
      toast.error("Name and Phone are required");
      return;
    }
    
    try {
        if (modalState.mode === 'add') {
            await api.addPartner(formData);
            toast.success("Partner registered successfully!");
        } else if (modalState.mode === 'edit') {
            await api.updatePartner(modalState.data.id, formData);
            toast.success("Partner updated successfully!");
        }
        
        await fetchPartners();
        handleModalClose();
    } catch (error) {
        toast.error("Failed to save partner");
    }
  };

  // Filter Logic
  const filteredPartners = partners.filter(partner => {
    const matchesStatus = filters.status ? partner.status === filters.status : true;
    const matchesSearch = filters.search 
      ? (partner.name.toLowerCase().includes(filters.search.toLowerCase()) || 
         partner.id.toLowerCase().includes(filters.search.toLowerCase()))
      : true;
    return matchesStatus && matchesSearch;
  });

  // Formatting for DataTable
  const tableData = filteredPartners.map(p => ({
    id: p.id,
    partner_id: p.id, // For display
    name: p.name,
    phone: p.phone,
    vehicle: p.vehicle || 'Bike',
    status: p.status,
    rating: p.rating ? `${p.rating}/5` : 'N/A',
    orders: p.trips || 0
  }));

  const columns = ['Partner ID', 'Name', 'Phone', 'Vehicle', 'Status', 'Rating', 'Orders', 'Actions'];

  const filterOptions = [
    {
      name: 'status',
      type: 'select',
      value: filters.status,
      options: [
        { value: '', label: 'All Status' },
        { value: 'Online', label: 'Online' },
        { value: 'Offline', label: 'Offline' },
        { value: 'Busy', label: 'Busy' }
      ]
    },
    {
      name: 'search',
      type: 'text',
      placeholder: 'Search Partner ID or Name',
      value: filters.search
    }
  ];

  // Stats Calculation
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'Online' || p.status === 'Busy').length;
  const offlinePartners = partners.filter(p => p.status === 'Offline').length;
  const busyPartners = partners.filter(p => p.status === 'Busy').length;

  // Map Simulation Helpers
  const getMapPosition = (loc) => {
    if (!loc || !loc.lat || !loc.lng) return { top: '50%', left: '50%' };
    
    const minLat = 19.00;
    const maxLat = 19.25;
    const minLng = 72.80;
    const maxLng = 73.00;

    let top = ((maxLat - loc.lat) / (maxLat - minLat)) * 100;
    let left = ((loc.lng - minLng) / (maxLng - minLng)) * 100;

    // Clamp values
    top = Math.max(5, Math.min(95, top));
    left = Math.max(5, Math.min(95, left));

    return { top: `${top}%`, left: `${left}%` };
  };

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
          form="partnerForm"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
            {modalState.mode === 'add' ? 'Register Partner' : 'Save Changes'}
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Partner Management</h1>

        {/* Partner Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalPartners}</div>
            <div className="text-gray-500 dark:text-gray-400">Total Partners</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{activePartners}</div>
            <div className="text-gray-500 dark:text-gray-400">Active / Online</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">{offlinePartners}</div>
            <div className="text-gray-500 dark:text-gray-400">Offline</div>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{busyPartners}</div>
            <div className="text-gray-500 dark:text-gray-400">Busy</div>
          </div>
        </div>

        {/* Live Map Simulation */}
        <div className="card p-4 relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              <i className="fas fa-map-marked-alt mr-2"></i> Live Partner Map (Mumbai Simulation)
            </h3>
            <span className="text-xs text-gray-500 animate-pulse">● Live Updates</span>
          </div>
          
          <div className="relative w-full h-80 bg-blue-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden">
             <div className="absolute inset-0 opacity-10" 
                  style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
             </div>

             {partners.map(partner => {
               const pos = getMapPosition(partner.location);
               const colorClass = partner.status === 'Online' ? 'bg-green-500' : 
                                  partner.status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-400';
               return (
                 <div 
                    key={partner.id}
                    className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform ${colorClass}`}
                    style={{ top: pos.top, left: pos.left }}
                    title={`${partner.name} (${partner.status})`}
                 >
                   {partner.status === 'Online' && (
                     <span className="absolute w-full h-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                   )}
                 </div>
               );
             })}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-gray-500 justify-end">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Online</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Busy</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span> Offline</div>
          </div>
        </div>

        {/* Partners Table */}
        <DataTable 
          title="Partner List"
          columns={columns}
          data={tableData}
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onAddNew={handleAddNewPartner}
          onRowAction={handleRowAction}
        />

        <Modal
            isOpen={modalState.open}
            onClose={handleModalClose}
            title={
                modalState.mode === 'add' ? 'Register New Partner' : 
                modalState.mode === 'edit' ? 'Edit Partner' : 'Partner Details'
            }
            footer={modalFooter}
        >
            {modalState.mode === 'view' ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Partner ID</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.phone}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.vehicle || 'Bike'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                            <span className={`mt-1 inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                modalState.data?.status === 'Online' ? 'bg-green-100 text-green-800' :
                                modalState.data?.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {modalState.data?.status}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Rating</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.rating ? `${modalState.data.rating}/5` : 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Total Trips</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{modalState.data?.trips || 0}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <form id="partnerForm" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            className="input w-full" 
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="e.g. Amit Kumar"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone"
                            required
                            className="input w-full" 
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Optional)</label>
                        <input 
                            type="email" 
                            name="email"
                            className="input w-full" 
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="partner@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                        <select 
                            name="vehicle"
                            className="input w-full"
                            value={formData.vehicle}
                            onChange={handleFormChange}
                        >
                            <option value="Bike">Bike</option>
                            <option value="Scooter">Scooter</option>
                            <option value="Cycle">Cycle</option>
                            <option value="Van">Van</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select 
                            name="status"
                            className="input w-full"
                            value={formData.status}
                            onChange={handleFormChange}
                        >
                            <option value="Offline">Offline</option>
                            <option value="Online">Online</option>
                            <option value="Busy">Busy</option>
                        </select>
                    </div>
                </form>
            )}
        </Modal>
      </div>
    </Layout>
  );
};

export default DeliveryPartners;