import React from 'react';

export const ChartContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full h-full ${className} overflow-hidden rounded-lg shadow-sm`}>
      {children}
    </div>
  );
};
