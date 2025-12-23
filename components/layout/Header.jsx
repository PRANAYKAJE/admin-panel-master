"use client";
import Link from 'next/link';
import { useState, useContext, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { GlobalContext } from '../../context/GlobalContext';
import { useRouter } from 'next/router';

const Header = ({ toggleSidebar }) => {
  const { searchQuery, performSearch, searchResults, loadingSearch } = useContext(GlobalContext);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const router = useRouter();

  // Mock Notifications
  const notifications = [
    { id: 1, text: "New Order #ORD-1002 received", time: "5m ago", read: false },
    { id: 2, text: "Store 'Fresh Mart' updated details", time: "1h ago", read: false },
    { id: 3, text: "Partner 'Raju' is online", time: "2h ago", read: true },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    performSearch(query);
    setShowResults(!!query);
  };

  const handleResultClick = (link) => {
    setShowResults(false);
    performSearch(''); // Clear search
    router.push(link);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = searchResults.orders.length > 0 || searchResults.stores.length > 0 || searchResults.partners.length > 0;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-[60] transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section: Logo & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none" 
            onClick={toggleSidebar} 
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link href="/dashboard" className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-bold text-xl">
            <i className="fas fa-store"></i>
            <span className="hidden sm:inline">Kirana Hub</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-green-500">
              <i className="fas fa-search text-gray-500 dark:text-gray-400 mr-2"></i>
              <input 
                type="text" 
                placeholder="Search orders, stores..." 
                className="bg-transparent border-none focus:outline-none w-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              {loadingSearch && <i className="fas fa-spinner fa-spin text-green-500 ml-2"></i>}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                {!hasResults && !loadingSearch ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">No results found</div>
                ) : (
                  <>
                    {/* Orders */}
                    {searchResults.orders.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Orders</h3>
                        {searchResults.orders.map(order => (
                          <div 
                            key={order.id} 
                            onClick={() => handleResultClick('/orders')}
                            className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{order.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.storeName} - ₹{order.amount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Stores */}
                    {searchResults.stores.length > 0 && (
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Stores</h3>
                        {searchResults.stores.map(store => (
                          <div 
                            key={store.id} 
                            onClick={() => handleResultClick('/stores')}
                            className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{store.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{store.owner}</p>
                          </div>
                        ))}
                      </div>
                    )}
                     {/* Partners */}
                     {searchResults.partners.length > 0 && (
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Partners</h3>
                        {searchResults.partners.map(partner => (
                          <div 
                            key={partner.id} 
                            onClick={() => handleResultClick('/partners')}
                            className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{partner.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{partner.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Notifications, Theme, User */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              className="relative focus:outline-none text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                  <button className="text-xs text-green-600 hover:text-green-700 dark:text-green-400">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notif.read ? 'bg-green-50 dark:bg-gray-900' : ''}`}>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{notif.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <Link href="/settings" className="block p-2 text-center text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                  View all
                </Link>
              </div>
            )}
          </div>

          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Admin" 
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
            />
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;