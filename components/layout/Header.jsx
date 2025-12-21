import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-[60] transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none" 
            onClick={toggleSidebar} 
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link href="/" className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-bold text-xl">
            <i className="fas fa-store"></i>
            <span className="hidden sm:inline">Kirana Hub</span>
          </Link>
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-64">
            <i className="fas fa-search text-gray-500 dark:text-gray-400 mr-2"></i>
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:outline-none w-full text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer">
            <i className="fas fa-bell text-gray-600 dark:text-gray-300 text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Admin" 
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;