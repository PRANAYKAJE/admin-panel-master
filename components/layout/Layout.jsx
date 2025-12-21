import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        closeSidebar={closeSidebar}
        currentPath={router.pathname}
      />
      <main className="flex-1 md:ml-60 p-6 md:p-[1.3rem] transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;