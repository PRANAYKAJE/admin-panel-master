import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import KpiCard from '../ui/KpiCard';
import GmvChart from '../charts/GmvChart';
import { api } from '../../services/api';

const Dashboard = () => {
  const [activePeriod, setActivePeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    totalOrders: 0,
    gmv: 0,
    successRate: 0,
    liveOrders: 0
  });
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch KPIs
      const kpis = await api.calculateKPIs();
      setKpiData(kpis);

      // Fetch Analytics
      const analytics = await api.getAnalytics();
      if (activePeriod === 'week') {
         setChartData(analytics.dailyGMV);
      } else if (activePeriod === 'month') {
         setChartData(analytics.weeklyGMV);
      } else {
         // Fallback or other periods
         setChartData(analytics.dailyGMV);
      }

      // Fetch Recent Orders for Activity Feed
      const orders = await api.getOrders();
      setRecentOrders(orders.slice(0, 5)); // Just take first 5
      
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activePeriod]);

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <button 
            onClick={handleRefresh}
            className="mt-4 md:mt-0 btn btn-outline flex items-center"
            disabled={loading}
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`}></i>
            Refresh Data
          </button>
        </div>

        {/* KPI Cards */}
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                 ))}
             </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
            title="Total Orders"
            value={kpiData.totalOrders.toLocaleString()}
            change="Based on local data"
            changeType="neutral"
            icon="shopping-cart"
            iconType="primary"
          />
          <KpiCard 
            title="Live Orders"
            value={kpiData.liveOrders.toLocaleString()}
            change="Pending orders"
            changeType="warning"
            icon="clock"
            iconType="warning"
          />
          <KpiCard 
            title="GMV"
            value={`₹${kpiData.gmv.toLocaleString()}`}
            change="Total Revenue"
            changeType="success"
            icon="dollar-sign"
            iconType="success"
          />
          <KpiCard 
            title="Delivery Success Rate"
            value={`${kpiData.successRate}%`}
            change="Completed / Total"
            changeType={parseFloat(kpiData.successRate) > 90 ? "success" : "negative"}
            icon="percentage"
            iconType="primary"
          />
        </div>
        )}

        {/* Chart Area */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GMV Trend</h2>
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
            </div>
          </div>
          <div className="h-80">
            {loading ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                    <span className="text-gray-400">Loading Chart...</span>
                </div>
            ) : (
                <GmvChart data={chartData} />
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>)}
                </div>
            ) : (
                recentOrders.length > 0 ? recentOrders.map((order, index) => (
                    <div key={index} className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    }`}>
                        <i className={`fas ${
                            order.status === 'Delivered' ? 'fa-check' :
                            order.status === 'Pending' ? 'fa-clock' :
                            'fa-times'
                        }`}></i>
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Order #{order.id}</div>
                        <div className="text-gray-500 dark:text-gray-300 text-sm">{order.storeName} • {new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">₹{order.amount}</div>
                    </div>
                )) : <div className="text-gray-500">No recent orders found.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
