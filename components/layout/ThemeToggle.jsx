import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
      onClick={toggleTheme} 
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
    </button>
  );
};

export default ThemeToggle;