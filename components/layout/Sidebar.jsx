import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = ({ isOpen, closeSidebar, currentPath }) => {
  const router = useRouter();
  const navItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/orders', icon: 'fas fa-box', label: 'Orders' },
    { path: '/stores', icon: 'fas fa-store', label: 'Stores' },
    { path: '/partners', icon: 'fas fa-motorcycle', label: 'Delivery Partners' },
    { path: '/analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/');
  };

  return (
    <aside className={`fixed top-0 left-0 h-full w-55 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="mt-16 px-4 py-6 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors duration-200 ${
              currentPath === item.path 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={closeSidebar}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;