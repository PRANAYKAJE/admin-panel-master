import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ orders: [], stores: [], partners: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Initialize User from local storage (simplified persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_auth');
    if (savedUser) {
      // In a real app, validate token here
      // setUser(JSON.parse(savedUser));
      // For this mock, we rely on the login page setting state, or we could re-fetch
    }
  }, []);

  const login = async (email, password) => {
      const response = await api.login(email, password);
      if (response.success) {
          setUser(response.user);
          return true;
      }
      return false;
  };

  const logout = () => {
      setUser(null);
      // router.push('/') handled in component
  };

  const performSearch = async (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
          setSearchResults({ orders: [], stores: [], partners: [] });
          return;
      }
      
      setLoadingSearch(true);
      try {
          // Parallel fetch
          const [orders, stores, partners] = await Promise.all([
              api.getOrders(),
              api.getStores(),
              api.getPartners()
          ]);

          const lowerQuery = query.toLowerCase();
          
          const filteredOrders = orders.filter(o => 
              o.id.toLowerCase().includes(lowerQuery) || 
              o.customerName?.toLowerCase().includes(lowerQuery) ||
              o.storeName?.toLowerCase().includes(lowerQuery)
          ).slice(0, 5); // Limit results

          const filteredStores = stores.filter(s => 
              s.name.toLowerCase().includes(lowerQuery) || 
              s.owner?.toLowerCase().includes(lowerQuery)
          ).slice(0, 5);

          const filteredPartners = partners.filter(p => 
              p.name.toLowerCase().includes(lowerQuery) ||
              p.phone?.includes(lowerQuery)
          ).slice(0, 5);

          setSearchResults({
              orders: filteredOrders,
              stores: filteredStores,
              partners: filteredPartners
          });
      } catch (error) {
          console.error("Search failed", error);
      } finally {
          setLoadingSearch(false);
      }
  };

  return (
    <GlobalContext.Provider value={{ 
        user, 
        setUser, 
        login, 
        logout,
        searchQuery, 
        setSearchQuery, 
        performSearch,
        searchResults,
        loadingSearch
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
