import { useState } from 'react';
import Layout from '../layout/Layout';
import KpiCard from '../ui/KpiCard';
import GmvChart from '../charts/GmvChart';

const Dashboard = () => {
  const [activePeriod, setActivePeriod] = useState('week');

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    console.log(`Changing chart period to: ${period}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
            title="Total Orders"
            value="12,849"
            change="12.5% from last month"
            changeType="positive"
            icon="shopping-cart"
            iconType="primary"
          />
          <KpiCard 
            title="Live Orders"
            value="248"
            change="8.2% from yesterday"
            changeType="positive"
            icon="clock"
            iconType="warning"
          />
          <KpiCard 
            title="GMV"
            value="₹2,48,560"
            change="18.7% from last month"
            changeType="positive"
            icon="dollar-sign"
            iconType="success"
          />
          <KpiCard 
            title="Delivery Success Rate"
            value="96.8%"
            change="1.2% from last month"
            changeType="negative"
            icon="percentage"
            iconType="primary"
          />
        </div>

        {/* Chart Area */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily GMV Trend</h2>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button 
                className={`px-3 py-1.5 text-sm rounded-lg ${activePeriod === 'week' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => handlePeriodChange('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-lg ${activePeriod === 'month' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => handlePeriodChange('month')}
              >
                Month
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-lg ${activePeriod === 'quarter' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => handlePeriodChange('quarter')}
              >
                Quarter
              </button>
            </div>
          </div>
          <div className="h-80">
            <GmvChart />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Live Orders</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 flex-shrink-0">
                <i className="fas fa-plus"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">New Order #ORD-7845</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Fresh Mart • ₹1,245</div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">2 min ago</div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-4 flex-shrink-0">
                <i className="fas fa-box"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Order #ORD-7821 in Preparation</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Daily Needs • ₹856</div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">15 min ago</div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 flex-shrink-0">
                <i className="fas fa-motorcycle"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Order #ORD-7805 Out for Delivery</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Kirana Corner • ₹2,340</div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">32 min ago</div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 flex-shrink-0">
                <i className="fas fa-plus"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">New Order #ORD-7798</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Super Store • ₹1,890</div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">45 min ago</div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 flex-shrink-0">
                <i className="fas fa-motorcycle"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Order #ORD-7782 Out for Delivery</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">City Mart • ₹3,120</div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;