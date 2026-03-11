import React from 'react';
import { classNames } from '../utils/classNames';

export const MetricCard = ({ title, value, unit, trend, trendValue, icon: Icon, status = 'normal' }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600',
  };

  const trendIcons = {
    up: 'arrow-up',
    down: 'arrow-down',
    stable: 'minus',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {unit && <p className="ml-2 text-sm text-gray-500">{unit}</p>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={classNames('text-sm font-medium', trendColors[trend])}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'stable' && '→'}
                {' '}{trendValue}
              </span>
              <span className="ml-2 text-sm text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={classNames(
            'p-3 rounded-full',
            status === 'critical' ? 'bg-red-100' : 
            status === 'warning' ? 'bg-yellow-100' : 
            'bg-blue-100'
          )}>
            <Icon className={classNames(
              'h-6 w-6',
              status === 'critical' ? 'text-red-600' : 
              status === 'warning' ? 'text-yellow-600' : 
              'text-blue-600'
            )} />
          </div>
        )}
      </div>
    </div>
  );
};