import authData from '../data/auth.json';
import ordersData from '../data/orders.json';
import storesData from '../data/stores.json';
import partnersData from '../data/partners.json';
import analyticsData from '../data/analytics.json';

const STORAGE_KEYS = {
  AUTH: 'admin_auth',
  ORDERS: 'admin_orders',
  STORES: 'admin_stores',
  PARTNERS: 'admin_partners',
  ANALYTICS: 'admin_analytics',
  AUDIT_LOGS: 'admin_audit_logs',
  SETTINGS: 'admin_settings'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORES)) {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(storesData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partnersData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analyticsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
          emailAlerts: true,
          smsNotifications: false,
          marketingEmails: true
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
};

export const api = {
  init: () => initializeStorage(),

  // Auth
  login: async (email, password) => {
    await delay(800);
    initializeStorage();
    const auth = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH));
    if (email === auth.email && password === auth.password) {
      return { success: true, user: auth };
    }
    throw new Error('Invalid credentials');
  },
  
  getUsers: async (search = '') => {
      await delay(400);
      // Mocking a user list for search
      const users = [
          { id: 1, name: 'Ramesh Gupta', email: 'ramesh@example.com' },
          { id: 2, name: 'Sita Verma', email: 'sita@example.com' },
          { id: 3, name: 'Amit Singh', email: 'amit@example.com' },
          { id: 4, name: 'Priya Sharma', email: 'priya@example.com' },
          { id: 5, name: 'Vikram Malhotra', email: 'vikram@example.com' }
      ];
      if (!search) return users;
      return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  },

  // Orders
  getOrders: async () => {
    await delay(500);
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  addOrder: async (order) => {
    await delay(500);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder = { ...order, id: `ORD-${1000 + orders.length + 1}`, date: new Date().toISOString() };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  updateOrder: async (id, updates) => {
    await delay(400);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found');
  },

  deleteOrder: async (id) => {
    await delay(300);
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrders = orders.filter(order => order.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
    return true;
  },

  // Stores
  getStores: async () => {
    await delay(500);
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
  },

  addStore: async (store) => {
    await delay(600);
    const stores = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
    const newStore = { 
        ...store, 
        id: `STR-00${stores.length + 1}`, 
        rating: 0, 
        totalSales: 0, 
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    };
    stores.push(newStore);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
    return newStore;
  },

  getStoreDetails: async (id) => {
      await delay(400);
      const stores = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORES) || '[]');
      const store = stores.find(s => s.id === id);
      if (!store) throw new Error('Store not found');
      
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      const storeOrders = orders.filter(o => o.storeName === store.name);
      
      return { ...store, orders: storeOrders };
  },

  // Partners
  getPartners: async () => {
    await delay(500);
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERS) || '[]');
  },

  addPartner: async (partner) => {
      await delay(600);
      const partners = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERS) || '[]');
      const newPartner = {
          ...partner,
          id: `DLP-00${partners.length + 1}`,
          status: 'Offline',
          trips: 0,
          rating: 5.0,
          location: { lat: 19.0760, lng: 72.8777 } // Default Mumbai
      };
      partners.push(newPartner);
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
      return newPartner;
  },

  updatePartner: async (id, updates) => {
    await delay(400);
    const partners = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERS) || '[]');
    const index = partners.findIndex(p => p.id === id);
    if (index !== -1) {
      partners[index] = { ...partners[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
      return partners[index];
    }
    throw new Error('Partner not found');
  },

  deletePartner: async (id) => {
    await delay(300);
    const partners = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERS) || '[]');
    const newPartners = partners.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(newPartners));
    return true;
  },

  // Analytics / KPIs
  calculateKPIs: async () => {
    await delay(200);
    initializeStorage();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    const totalOrders = orders.length;
    const gmv = orders.reduce((acc, order) => acc + (parseFloat(order.amount) || 0), 0);
    
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const successRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0;
    
    const liveOrders = orders.filter(o => o.status === 'Pending' || o.status === 'In Preparation').length;

    return {
      totalOrders,
      gmv,
      successRate,
      liveOrders
    };
  },

  getAnalytics: async () => {
      await delay(300);
      initializeStorage();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '{}');
  },

  // Settings & Notifications
  getSettings: async () => {
      await delay(200);
      initializeStorage();
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
  },

  updateSettings: async (newSettings) => {
      await delay(300);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      return newSettings;
  },

  sendNotification: async (notification) => {
      await delay(800);
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
      logs.unshift({
          id: Date.now(),
          ...notification,
          timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
      return true;
  }
};
