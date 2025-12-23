import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GmvChart = ({ data }) => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const isDark = theme === 'dark';
    
    const labels = data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = data?.data || [0, 0, 0, 0, 0, 0, 0];

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'GMV (₹)',
          data: values,
          borderColor: isDark ? '#39D377' : '#00A86B',
          backgroundColor: isDark ? 'rgba(57, 211, 119, 0.1)' : 'rgba(0, 168, 107, 0.1)',
          tension: 0.4,
        },
      ],
    });

    setChartOptions({
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
          callbacks: {
            label: (context) => `GMV: ₹${context.parsed.y.toLocaleString()}`
          }
        },
      },
      scales: {
        x: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: { color: isDark ? '#B0B0B0' : '#4B5563' },
        },
        y: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            color: isDark ? '#B0B0B0' : '#4B5563',
            callback: (value) => '₹' + value.toLocaleString()
          },
        },
      },
    });
  }, [theme, data]);

  return <Line data={chartData} options={chartOptions} />;
};

export default GmvChart;