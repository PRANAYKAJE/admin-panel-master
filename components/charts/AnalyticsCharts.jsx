import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsCharts = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    // Orders by Store Chart Data
    const ordersByStoreData = {
      labels: ['Fresh Mart', 'Daily Needs', 'Kirana Corner', 'Super Store', 'City Mart', 'Quick Mart'],
      datasets: [
        {
          label: 'Orders',
          data: [420, 380, 350, 290, 260, 240],
          backgroundColor: isDark ? '#39D377' : '#00A86B',
        },
      ],
    };

    const ordersByStoreOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#282828' : '#FFFFFF',
          titleColor: isDark ? '#E0E0E0' : '#1F2937',
          bodyColor: isDark ? '#B0B0B0' : '#4B5563',
          borderColor: isDark ? '#333333' : '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: isDark ? '#B0B0B0' : '#4B5563' },
        },
        y: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: isDark ? '#B0B0B0' : '#4B5563' },
        },
      },
    };

    // Order Status Distribution Chart Data
    const orderStatusData = {
      labels: ['Delivered', 'In Preparation', 'Out for Delivery', 'New', 'Cancelled'],
      datasets: [
        {
          data: [65, 15, 10, 7, 3],
          backgroundColor: [
            isDark ? '#1ED760' : '#1DB954',
            isDark ? '#FFB84C' : '#FF7A00',
            isDark ? '#39D377' : '#00A86B',
            isDark ? '#1ED760' : '#1DB954',
            isDark ? '#FF6666' : '#FF4D4D',
          ],
          borderWidth: 0,
        },
      ],
    };

    const orderStatusOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: isDark ? '#E0E0E0' : '#1F2937',
            padding: 15,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#282828' : '#FFFFFF',
          titleColor: isDark ? '#E0E0E0' : '#1F2937',
          bodyColor: isDark ? '#B0B0B0' : '#4B5563',
          borderColor: isDark ? '#333333' : '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`,
          },
        },
      },
    };

    // Delivery Performance Chart Data
    const deliveryPerformanceData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'On Time',
          data: [92, 94, 90, 95, 93, 91, 89],
          backgroundColor: isDark ? '#1ED760' : '#1DB954',
        },
        {
          label: 'Delayed',
          data: [6, 4, 7, 3, 5, 7, 9],
          backgroundColor: isDark ? '#FF6666' : '#FF4D4D',
        },
        {
          label: 'Cancelled',
          data: [2, 2, 3, 2, 2, 2, 2],
          backgroundColor: isDark ? '#FFB84C' : '#FF7A00',
        },
      ],
    };

    const deliveryPerformanceOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDark ? '#E0E0E0' : '#1F2937',
            padding: 15,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#282828' : '#FFFFFF',
          titleColor: isDark ? '#E0E0E0' : '#1F2937',
          bodyColor: isDark ? '#B0B0B0' : '#4B5563',
          borderColor: isDark ? '#333333' : '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: isDark ? '#B0B0B0' : '#4B5563' },
        },
        y: {
          stacked: true,
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            color: isDark ? '#B0B0B0' : '#4B5563',
            callback: (value) => value + '%',
          },
        },
      },
    };

    return {
      ordersByStoreData,
      ordersByStoreOptions,
      orderStatusData,
      orderStatusOptions,
      deliveryPerformanceData,
      deliveryPerformanceOptions
    };
  }, [isDark]);

  return chartData;
};

export default AnalyticsCharts;