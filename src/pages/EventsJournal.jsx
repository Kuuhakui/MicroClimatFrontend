import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const SEVERITY_LABELS = {
  THRESHOLD_EXCEEDED: { label: 'Превышение уставки', color: 'bg-red-100 text-red-700' },
  INFO: { label: 'Информация', color: 'bg-blue-100 text-blue-700' },
  DEFAULT: { label: 'Событие', color: 'bg-gray-100 text-gray-700' },
};

const EventsJournal = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: events = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/events/?skip=0&limit=100').then(r => r.data),
    refetchInterval: 15000,
  });

  const sortedEvents = [...events].reverse();
  const filtered = filter === 'all'
    ? sortedEvents
    : sortedEvents.filter(e => e.event_type === filter);

  const uniqueTypes = [...new Set(events.map(e => e.event_type))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Журнал событий</h1>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Все ({events.length})
        </button>
        {uniqueTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {SEVERITY_LABELS[type]?.label ?? type} ({events.filter(e => e.event_type === type).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <RefreshCw size={24} className="animate-spin mr-2" /> Загрузка...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            <CheckCircle size={32} className="text-green-400" />
            <span>Нет событий</span>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Время</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сервис</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сообщение</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((ev, i) => {
                const meta = SEVERITY_LABELS[ev.event_type] ?? SEVERITY_LABELS.DEFAULT;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock size={13} className="text-gray-400" />
                        {new Date(ev.timestamp).toLocaleString('ru-RU')}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">{ev.service}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 max-w-md truncate">{ev.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventsJournal;