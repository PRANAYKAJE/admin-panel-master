import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsCharts = (analyticsData) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    if (!analyticsData) return {};

    // Orders by Store Chart Data
    const ordersByStoreData = {
      labels: analyticsData.ordersByStore?.labels || [],
      datasets: [
        {
          label: 'Orders',
          data: analyticsData.ordersByStore?.data || [],
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
      labels: analyticsData.orderStatus?.labels || [],
      datasets: [
        {
          data: analyticsData.orderStatus?.data || [],
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
      labels: analyticsData.deliveryPerformance?.labels || [],
      datasets: (analyticsData.deliveryPerformance?.datasets || []).map((dataset, index) => ({
        ...dataset,
        backgroundColor: index === 0 
          ? (isDark ? '#1ED760' : '#1DB954') 
          : index === 1 
            ? (isDark ? '#FF6666' : '#FF4D4D') 
            : (isDark ? '#FFB84C' : '#FF7A00'),
      })),
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
  }, [isDark, analyticsData]);

  return chartData;
};

export default AnalyticsCharts;