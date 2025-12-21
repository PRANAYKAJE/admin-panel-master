import { useState, useMemo } from 'react';
import Layout from '../layout/Layout';
import AnalyticsCharts from '../charts/AnalyticsCharts';
import { useTheme } from '../../context/ThemeContext';
import { Bar, Pie } from 'react-chartjs-2';

const Analytics = () => {
  const [activePeriod, setActivePeriod] = useState('month');
  const [activeReportPeriod, setActiveReportPeriod] = useState('This Month');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    console.log(`Changing analytics period to: ${period}`);
  };

  const financialReportsData = [
    { 
      reportType: 'Daily Sales', 
      period: 'Today', 
      revenue: '₹45,680', 
      orders: 324, 
      avgValue: '₹141', 
      commission: '₹4,568', 
      payouts: '₹32,450' 
    },
    { 
      reportType: 'Weekly Sales', 
      period: 'This Week', 
      revenue: '₹2,85,420', 
      orders: 1856, 
      avgValue: '₹154', 
      commission: '₹28,542', 
      payouts: '₹2,05,680' 
    },
    { 
      reportType: 'Monthly Sales', 
      period: 'This Month', 
      revenue: '₹12,48,560', 
      orders: 7842, 
      avgValue: '₹159', 
      commission: '₹1,24,856', 
      payouts: '₹8,96,420' 
    },
  ];

  const chartData = AnalyticsCharts();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orders by Store</h3>
            <div className="h-80">
              <Bar data={chartData.ordersByStoreData} options={chartData.ordersByStoreOptions} />
            </div>
          </div>

          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
            <div className="h-80">
              <Pie data={chartData.orderStatusData} options={chartData.orderStatusOptions} />
            </div>
          </div>

          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Performance</h3>
            <div className="h-80">
              <Bar data={chartData.deliveryPerformanceData} options={chartData.deliveryPerformanceOptions} />
            </div>
          </div>
        </div>
        
        {/* Financial Reports Table Section */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">Financial Reports</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select 
                className="input w-full md:w-auto"
                value={activeReportPeriod}
                onChange={(e) => setActiveReportPeriod(e.target.value)}
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
              </select>
              
              <button 
                className="btn btn-primary w-full md:w-auto"
                onClick={() => console.log('Exporting report...')}
              >
                <i className="fas fa-download mr-2"></i>
                Export Report
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Report Type</th>
                  <th>Period</th>
                  <th>Total Revenue</th>
                  <th>Total Orders</th>
                  <th>Avg. Order Value</th>
                  <th>Commission</th>
                  <th>Payouts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {financialReportsData.map((report, index) => (
                  <tr key={report.reportType} 
                    className={index > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                  >
                    <td className="font-medium text-gray-900 dark:text-white">{report.reportType}</td>
                    <td>{report.period}</td>
                    <td className="font-medium">{report.revenue}</td>
                    <td>{report.orders}</td>
                    <td>{report.avgValue}</td>
                    <td>{report.commission}</td>
                    <td>{report.payouts}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                          onClick={() => console.log(`Viewing ${report.reportType}`)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => console.log(`Downloading ${report.reportType}`)}
                          title="Download Report"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;