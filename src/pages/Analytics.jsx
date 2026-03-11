import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { classNames } from '../utils/classNames';
import { ChartContainer } from '../components/ChartContainer';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  // Mock data - in a real app, this would come from an API
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [21, 20, 22, 24, 25, 23, 22],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Humidity (%)',
        data: [45, 48, 50, 55, 52, 48, 46],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Climate Trends - Today',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">
            Real-time
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            History
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <ChartContainer className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Temperature Analysis</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </ChartContainer>

        {/* Humidity Chart */}
        <ChartContainer className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Humidity Analysis</h3>
          <div className="h-64">
            <Line 
              data={{
                ...chartData,
                datasets: [chartData.datasets[1]]
              }} 
              options={chartOptions} 
            />
          </div>
        </ChartContainer>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Forecast Comparison</h3>
        <p className="text-gray-600">
          ML model predictions vs actual measurements will be displayed here.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Feature: ML Forecast Preview (coming soon)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;