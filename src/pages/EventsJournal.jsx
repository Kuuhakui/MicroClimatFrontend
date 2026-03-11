import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { classNames } from '../utils/classNames';
import { StatusBadge } from '../components/StatusBadge';

const EventsJournal = () => {
  // Mock data - in a real app, this would come from an API
  const [events, setEvents] = useState([
    { id: 1, timestamp: '2026-03-01T10:15:00Z', type: 'temperature_alert', severity: 'critical', description: 'Office temperature exceeded threshold', resolved: false },
    { id: 2, timestamp: '2026-03-01T11:30:00Z', type: 'humidity_change', severity: 'warning', description: 'Conference room humidity increased', resolved: true },
    { id: 3, timestamp: '2026-03-01T14:20:00Z', type: 'sensor_failure', severity: 'critical', description: 'Sensor #12 offline', resolved: false },
    { id: 4, timestamp: '2026-03-01T16:45:00Z', type: 'maintenance', severity: 'normal', description: 'Routine sensor calibration', resolved: true },
  ]);

  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredEvents = events.filter(event => 
    filterSeverity === 'all' || event.severity === filterSeverity
  );

  const handleTakeWork = (eventId) => {
    console.log(`Taking event ${eventId} into work`);
    // In a real app, this would call an API
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Events Journal</h2>
      
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm text-gray-500">Filter by severity:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={classNames(
              'px-3 py-1 rounded-md text-sm font-medium',
              filterSeverity === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={classNames(
              'px-3 py-1 rounded-md text-sm font-medium',
              filterSeverity === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-200'
            )}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={classNames(
              'px-3 py-1 rounded-md text-sm font-medium',
              filterSeverity === 'warning' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            )}
          >
            Warning
          </button>
          <button
            onClick={() => setFilterSeverity('normal')}
            className={classNames(
              'px-3 py-1 rounded-md text-sm font-medium',
              filterSeverity === 'normal' ? 'bg-green-600 text-white' : 'bg-gray-200'
            )}
          >
            Normal
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">Time</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">Type</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">Severity</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">Description</th>
              <th className="px-6 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="px-6 py-2 text-sm text-gray-700">{new Date(event.timestamp).toLocaleString()}</td>
                <td className="px-6 py-2 text-sm text-gray-700 capitalize">{event.type.replace('_', ' ')}</td>
                <td className="px-6 py-2 text-sm">
                  <span className={classNames(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    event.severity === 'normal' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  )}>
                    {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-2 text-sm text-gray-700 break-all">{event.description}</td>
                <td className="px-6 py-2 text-sm">
                  {event.resolved ? (
                    <span className="text-green-600">Resolved</span>
                  ) : (
                    <button
                      onClick={() => handleTakeWork(event.id)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Take in work
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsJournal;