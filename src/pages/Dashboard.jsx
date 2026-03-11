import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { classNames } from '../utils/classNames';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';

import { Home, Activity, AlertCircle, Zap } from 'lucide-react';

const Dashboard = () => {
  // In a real app, this would fetch real data
  const { data, isLoading, error } = useQuery({
  queryKey: ['system-metrics'],
  queryFn: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          rooms: 5,
          sensors: 12,
          criticalAlerts: 2,
          uptime: '99.8%',
        });
      }, 1000);
    });
  }
});

  if (isLoading) return <div className="p-6 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading dashboard</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Room Count Card */}
       <MetricCard 
  title="Total Rooms" 
  value={data.rooms} 
  icon={Home} // Без кавычек
  status="online"
/>
<MetricCard 
  title="Active Sensors" 
  value={data.sensors} 
  icon={Activity} 
  status="online"
/>
<MetricCard 
  title="Critical Alerts" 
  value={data.criticalAlerts} 
  icon={AlertCircle} 
  status="critical"
/>
<MetricCard 
  title="System Uptime" 
  value={data.uptime} 
  icon={Zap} 
  status="online"
/>
      </div>
      
      <div className="mt-8">
        <StatusBadge status="online" />
        <p className="mt-2 text-sm text-gray-600">All systems operational</p>
      </div>
    </div>
  );
};

export default Dashboard;