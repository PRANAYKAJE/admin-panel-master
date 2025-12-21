import { useState } from 'react';
import Layout from '../layout/Layout';

const Settings = () => {
  // Notification Compose State
  const [composeNotification, setComposeNotification] = useState({
    recipientType: 'all',
    notificationType: 'info',
    title: '',
    message: ''
  });

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
    newOrder: 'Enabled',
    deliveryAlerts: 'Enabled',
    paymentNotifications: 'Enabled',
    systemAlerts: 'Enabled'
  });

  // Handlers
  const handleChange = (setState, name, value) => {
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendNotification = () => {
    console.log('Sending notification:', composeNotification);
    alert(`Notification sent: "${composeNotification.title}" to ${composeNotification.recipientType}`);
    // Reset form
    setComposeNotification({
      recipientType: 'all',
      notificationType: 'info',
      title: '',
      message: ''
    });
  };

  const handleSaveUserManagement = () => {
    console.log('Saving User Management settings:', userManagement);
    alert('User Management settings saved!');
  };

  const handleSaveDeliveryConfig = () => {
    console.log('Saving Delivery Configuration:', deliveryConfig);
    alert('Delivery Configuration saved!');
  };

  const handleCreateCoupon = () => {
    console.log('Creating Coupon:', couponConfig);
    alert(`Coupon ${couponConfig.couponCode} created!`);
  };

  const handleSaveNotificationToggles = () => {
    console.log('Saving Notification Toggles:', notificationToggles);
    alert('Notification Toggles saved!');
  };

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
                  className="input"
                  value={composeNotification.recipientType}
                  onChange={(e) => handleChange(setComposeNotification, 'recipientType', e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="stores">All Stores</option>
                  <option value="partners">All Delivery Partners</option>
                  <option value="customers">All Customers</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Type</label>
                <select 
                  className="input"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                className="input"
                placeholder="Enter notification title"
                value={composeNotification.title}
                onChange={(e) => handleChange(setComposeNotification, 'title', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                className="input"
                rows={4}
                placeholder="Enter your notification message here..."
                value={composeNotification.message}
                onChange={(e) => handleChange(setComposeNotification, 'message', e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary" onClick={handleSendNotification}>
                Send Notification
              </button>
            </div>
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
                  className="input"
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
                  className="input"
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
                className="input"
                placeholder="user@example.com"
                value={userManagement.email}
                onChange={(e) => handleChange(setUserManagement, 'email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                className="input"
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
                  className="input"
                  placeholder="0"
                  value={deliveryConfig.baseFee}
                  onChange={(e) => handleChange(setDeliveryConfig, 'baseFee', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee per Kilometer</label>
                <input 
                  type="number" 
                  className="input"
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
                  className="input"
                  placeholder="0"
                  value={deliveryConfig.minOrderValue}
                  onChange={(e) => handleChange(setDeliveryConfig, 'minOrderValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free Delivery Threshold</label>
                <input 
                  type="number" 
                  className="input"
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
                className="input"
                placeholder="Enter coupon code"
                value={couponConfig.couponCode}
                onChange={(e) => handleChange(setCouponConfig, 'couponCode', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                <select 
                  className="input"
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
                  className="input"
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
                  className="input"
                  placeholder="0"
                  value={couponConfig.minOrderValue}
                  onChange={(e) => handleChange(setCouponConfig, 'minOrderValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  className="input"
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

        {/* Notification Settings Toggles Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Order Notifications</label>
              <select 
                className="input"
                value={notificationToggles.newOrder}
                onChange={(e) => handleChange(setNotificationToggles, 'newOrder', e.target.value)}
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Alerts</label>
              <select 
                className="input"
                value={notificationToggles.deliveryAlerts}
                onChange={(e) => handleChange(setNotificationToggles, 'deliveryAlerts', e.target.value)}
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Notifications</label>
              <select 
                className="input"
                value={notificationToggles.paymentNotifications}
                onChange={(e) => handleChange(setNotificationToggles, 'paymentNotifications', e.target.value)}
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Alerts</label>
              <select 
                className="input"
                value={notificationToggles.systemAlerts}
                onChange={(e) => handleChange(setNotificationToggles, 'systemAlerts', e.target.value)}
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveNotificationToggles}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;