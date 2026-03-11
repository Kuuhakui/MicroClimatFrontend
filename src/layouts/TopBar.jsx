import React from 'react';
import { useLocation } from 'react-router-dom';
import { classNames } from '../utils/classNames';
import { StatusBadge } from '../components/StatusBadge';

export const TopBar = () => {
  const location = useLocation();
  const route = location.pathname;

  const navigationTabs = [
    { path: '/dashboard', label: 'Dashboard', active: route === '/dashboard' },
    { path: '/map', label: 'Map', active: route === '/map' },
    { path: '/analytics', label: 'Analytics', active: route === '/analytics' },
    { path: '/events', label: 'Events', active: route === '/events' },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo and Title */}
      <div className="flex-shrink-0">
        <span className="text-xl font-bold text-gray-900">MicroClimat</span>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden md:flex space-x-4">
        {navigationTabs.map((tab) => (
          <span
            key={tab.path}
            className={classNames(
              'text-sm font-medium text-gray-500',
              tab.active ? 'text-indigo-600' : 'text-gray-400',
              'hover:text-indigo-600'
            )}
            onClick={() => window.history.pushState({}, '', tab.path)}
          >
            {tab.label}
          </span>
        ))}
      </div>

      {/* User Controls */}
      <div className="flex items-center space-x-4">
        <StatusBadge status="online" className="ml-2" />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">User: Admin</span>
          <span className="text-sm text-gray-500">|</span>
          <span className="text-sm text-gray-500">Notifications: 3</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;