import React from 'react';
import { classNames } from '../utils/classNames';

// Добавляем export прямо сюда
export const StatusBadge = ({ status, children }) => {
  const statusClasses = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-gray-100 text-gray-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
    maintenance: 'bg-blue-100 text-blue-800',
  };

  return (
    <span 
      className={classNames(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
        statusClasses[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {/* Если текста внутри нет, выводим само название статуса */}
      {children || status}
    </span>
  );
};