import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { classNames } from '../utils/classNames';
import { StatusBadge } from '../components/StatusBadge';

const RoomMap = () => {
  const { data: rooms, isLoading, error } = useQuery({
  queryKey: ['rooms'],
  queryFn: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Office', status: 'online', temperature: 22.5, humidity: 45 },
          { id: 2, name: 'Conference Room', status: 'warning', temperature: 24.1, humidity: 52 },
          { id: 3, name: 'Server Room', status: 'online', temperature: 18.2, humidity: 38 },
          { id: 4, name: 'Storage', status: 'offline', temperature: null, humidity: null },
          { id: 5, name: 'Reception', status: 'online', temperature: 23.0, humidity: 48 },
        ]);
      }, 1000);
    });
  }
});

  if (isLoading) return <div className="p-6 text-center">Loading room map...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading room map</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Room Map</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          {/* SVG Map Background */}
          <svg 
            viewBox="0 0 800 600" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Room Outlines */}
            <g className="room-outlines">
              {/* Office */}
              <rect x="50" y="50" width="200" height="150" 
                fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="4" />
              <text x="150" y="125" textAnchor="middle" className="fill-gray-700 text-sm font-medium">Office</text>
              
              {/* Conference Room */}
              <rect x="300" y="50" width="200" height="150" 
                fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="4" />
              <text x="400" y="125" textAnchor="middle" className="fill-gray-700 text-sm font-medium">Conference</text>
              
              {/* Server Room */}
              <rect x="550" y="50" width="200" height="150" 
                fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="4" />
              <text x="650" y="125" textAnchor="middle" className="fill-gray-700 text-sm font-medium">Server Room</text>
              
              {/* Storage */}
              <rect x="50" y="250" width="200" height="150" 
                fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="4" />
              <text x="150" y="325" textAnchor="middle" className="fill-gray-700 text-sm font-medium">Storage</text>
              
              {/* Reception */}
              <rect x="300" y="250" width="200" height="150" 
                fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" rx="4" />
              <text x="400" y="325" textAnchor="middle" className="fill-gray-700 text-sm font-medium">Reception</text>
            </g>
            
            {/* Sensor Markers */}
            <g className="sensor-markers">
              {rooms?.map((room, index) => {
                const positions = [
                  { x: 150, y: 100 },
                  { x: 400, y: 100 },
                  { x: 650, y: 100 },
                  { x: 150, y: 300 },
                  { x: 400, y: 300 },
                ];
                const pos = positions[index] || { x: 0, y: 0 };
                const statusColor = 
                  room.status === 'online' ? '#10b981' :
                  room.status === 'warning' ? '#f59e0b' :
                  room.status === 'critical' ? '#ef4444' : '#9ca3af';
                
                return (
                  <g key={room.id} className="sensor-group">
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="12" 
                      fill={statusColor} 
                      stroke="white" 
                      strokeWidth="2"
                      className="cursor-pointer hover:r-16 transition-all"
                    >
                      <title>{room.name} - {room.temperature}°C, {room.humidity}%</title>
                    </circle>
                    <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
                      {room.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded shadow p-3">
            <div className="text-sm font-medium mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-xs">Offline</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Room Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms?.map((room) => (
              <div key={room.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{room.name}</h4>
                  <StatusBadge status={room.status} />
                </div>
                {room.temperature && (
                  <div className="text-sm text-gray-600">
                    <p>Temperature: {room.temperature}°C</p>
                    <p>Humidity: {room.humidity}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomMap;