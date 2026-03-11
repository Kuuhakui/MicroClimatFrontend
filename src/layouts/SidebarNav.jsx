import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BarChart2, Calendar, Settings, User, Cpu } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { classNames } from '../utils/classNames';

export const SidebarNav = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Cpu className="h-8 w-8 text-indigo-600" />
            <p className="ml-2 text-sm font-medium text-gray-900">MicroClimat</p>
          </div>
          <StatusBadge status="online">Online</StatusBadge>
        </div>
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => classNames(
                'flex items-center px-3 py-2.5 text-base font-medium transition-colors',
                isActive ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-indigo-50'
              )}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SidebarNav; // Важно: в App.jsx ты импортируешь его без скобок!