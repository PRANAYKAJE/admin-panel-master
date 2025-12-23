import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  // Notification Compose State
  const [composeNotification, setComposeNotification] = useState({
    recipientType: 'all',
    notificationType: 'info',
    title: '',
    message: ''
  });

  // User Search State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // User Management State
  const [userManagement, setUserManagement] = useState({
    role: 'Admin',
    permissions: 'Full Access',
    email: '',
    password: ''
  });
  
  // Delivery Configuration State
  const [deliveryConfig, setDeliveryConfig] = useState({
    baseFee: 50,
    feePerKm: 10,
    minOrderValue: 100,
    freeDeliveryThreshold: 500
  });

  // Promotions & Coupons State
  const [couponConfig, setCouponConfig] = useState({
    couponCode: '',
    discountType: 'Percentage',
    discountValue: 0,
    minOrderValue: 0,
    expiryDate: ''
  });

  // Notification Toggle State
  const [notificationToggles, setNotificationToggles] = useState({
    newOrder: true,
    deliveryAlerts: true,
    paymentNotifications: true,
    systemAlerts: true,
    emailAlerts: true,
    smsNotifications: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings();
      if (settings && Object.keys(settings).length > 0) {
        setNotificationToggles(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  };

  // Handlers
  const handleChange = (setState, name, value) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSearch = async (query) => {
    setUserSearchQuery(query);
    if (query.length > 1) {
      try {
        const results = await api.getUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error("User search failed", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setUserSearchQuery(user.name);
    setSearchResults([]);
  };

  const handleSendNotification = async () => {
    if (!composeNotification.title || !composeNotification.message) {
      toast.error("Please provide title and message");
      return;
    }
    
    if (composeNotification.recipientType === 'specific' && !selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      await api.sendNotification({
        ...composeNotification,
        targetUser: selectedUser ? selectedUser.id : null,
        targetName: selectedUser ? selectedUser.name : composeNotification.recipientType
      });
      
      toast.success(`Notification sent to ${composeNotification.recipientType === 'specific' ? selectedUser.name : composeNotification.recipientType}`);
      
      // Reset form
      setComposeNotification({
        recipientType: 'all',
        notificationType: 'info',
        title: '',
        message: ''
      });
      setSelectedUser(null);
      setUserSearchQuery('');
    } catch (error) {
      toast.error("Failed to send notification");
    }
  };

  const handleSaveUserManagement = () => {
    console.log('Saving User Management settings:', userManagement);
    toast.success('User Management settings saved!');
  };

  const handleSaveDeliveryConfig = () => {
    console.log('Saving Delivery Configuration:', deliveryConfig);
    toast.success('Delivery Configuration saved!');
  };

  const handleCreateCoupon = () => {
    console.log('Creating Coupon:', couponConfig);
    toast.success(`Coupon ${couponConfig.couponCode} created!`);
  };

  const handleSaveNotificationToggles = async () => {
    try {
      await api.updateSettings(notificationToggles);
      toast.success('Notification Settings saved!');
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
      <button 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${checked ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>

        {/* Notification Compose Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Notifications</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Type</label>
                <select 
                  className="input w-full"
                  value={composeNotification.recipientType}
                  onChange={(e) => handleChange(setComposeNotification, 'recipientType', e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="stores">All Stores</option>
                  <option value="partners">All Delivery Partners</option>
                  <option value="customers">All Customers</option>
                  <option value="specific">Specific User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Type</label>
                <select 
                  className="input w-full"
                  value={composeNotification.notificationType}
                  onChange={(e) => handleChange(setComposeNotification, 'notificationType', e.target.value)}
                >
                  <option value="info">Information</option>
                  <option value="promotion">Promotion</option>
                  <option value="alert">Alert</option>
                  <option value="update">Update</option>
                </select>
              </div>
            </div>

            {composeNotification.recipientType === 'specific' && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search User</label>
                <input 
                  type="text" 
                  className="input w-full"
                  placeholder="Type name to search..."
                  value={userSearchQuery}
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {searchResults.map(user => (
                      <div 
                        key={user.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                        onClick={() => selectUser(user)}
                      >
                        {user.name} <span className="text-xs text-gray-500">({user.email})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                className="input w-full"
                placeholder="Enter notification title"
                value={composeNotification.title}
                onChange={(e) => handleChange(setComposeNotification, 'title', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                className="input w-full"
                rows={4}
                placeholder="Enter your notification message here..."
                value={composeNotification.message}
                onChange={(e) => handleChange(setComposeNotification, 'message', e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary"
                onClick={() => setComposeNotification({recipientType: 'all', notificationType: 'info', title: '', message: ''})}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSendNotification}>
                Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings Toggles Section */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
             <button className="btn btn-sm btn-primary" onClick={handleSaveNotificationToggles}>Save Changes</button>
          </div>
          
          <div className="space-y-1">
            <ToggleSwitch 
              label="New Order Notifications" 
              checked={notificationToggles.newOrder} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, newOrder: val}))} 
            />
            <ToggleSwitch 
              label="Delivery Alerts" 
              checked={notificationToggles.deliveryAlerts} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, deliveryAlerts: val}))} 
            />
            <ToggleSwitch 
              label="Payment Notifications" 
              checked={notificationToggles.paymentNotifications} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, paymentNotifications: val}))} 
            />
            <ToggleSwitch 
              label="System Alerts" 
              checked={notificationToggles.systemAlerts} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, systemAlerts: val}))} 
            />
            <ToggleSwitch 
              label="Email Alerts" 
              checked={notificationToggles.emailAlerts} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, emailAlerts: val}))} 
            />
            <ToggleSwitch 
              label="SMS Notifications" 
              checked={notificationToggles.smsNotifications} 
              onChange={(val) => setNotificationToggles(prev => ({...prev, smsNotifications: val}))} 
            />
          </div>
        </div>

        {/* User Management Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Role</label>
                <select 
                  className="input w-full"
                  value={userManagement.role}
                  onChange={(e) => handleChange(setUserManagement, 'role', e.target.value)}
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Support Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permissions</label>
                <select 
                  className="input w-full"
                  value={userManagement.permissions}
                  onChange={(e) => handleChange(setUserManagement, 'permissions', e.target.value)}
                >
                  <option>Full Access</option>
                  <option>Limited Access</option>
                  <option>Read Only</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                className="input w-full"
                placeholder="user@example.com"
                value={userManagement.email}
                onChange={(e) => handleChange(setUserManagement, 'email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                className="input w-full"
                placeholder="••••••••"
                value={userManagement.password}
                onChange={(e) => handleChange(setUserManagement, 'password', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveUserManagement}>Save Changes</button>
            </div>
          </div>
        </div>

        {/* Delivery Configuration Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Configuration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Delivery Fee</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={deliveryConfig.baseFee}
                  onChange={(e) => handleChange(setDeliveryConfig, 'baseFee', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee per Kilometer</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={deliveryConfig.feePerKm}
                  onChange={(e) => handleChange(setDeliveryConfig, 'feePerKm', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Order Value</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={deliveryConfig.minOrderValue}
                  onChange={(e) => handleChange(setDeliveryConfig, 'minOrderValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free Delivery Threshold</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={deliveryConfig.freeDeliveryThreshold}
                  onChange={(e) => handleChange(setDeliveryConfig, 'freeDeliveryThreshold', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveDeliveryConfig}>Save Changes</button>
            </div>
          </div>
        </div>

        {/* Promotions & Coupons Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Promotions & Coupons</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
              <input 
                type="text" 
                className="input w-full"
                placeholder="Enter coupon code"
                value={couponConfig.couponCode}
                onChange={(e) => handleChange(setCouponConfig, 'couponCode', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                <select 
                  className="input w-full"
                  value={couponConfig.discountType}
                  onChange={(e) => handleChange(setCouponConfig, 'discountType', e.target.value)}
                >
                  <option>Percentage</option>
                  <option>Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Value</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={couponConfig.discountValue}
                  onChange={(e) => handleChange(setCouponConfig, 'discountValue', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Order Value</label>
                <input 
                  type="number" 
                  className="input w-full"
                  placeholder="0"
                  value={couponConfig.minOrderValue}
                  onChange={(e) => handleChange(setCouponConfig, 'minOrderValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  className="input w-full"
                  value={couponConfig.expiryDate}
                  onChange={(e) => handleChange(setCouponConfig, 'expiryDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateCoupon}>Create Coupon</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;