import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Thermometer, Droplets, Cpu, CheckCircle, Clock } from 'lucide-react';
import api, { mlApi } from '../services/api';

const MetricCard = ({ title, value, unit, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div className="flex items-end gap-1">
      <span className="text-3xl font-bold text-gray-900">{value ?? '—'}</span>
      {unit && <span className="text-sm text-gray-400 mb-1">{unit}</span>}
    </div>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

const StatusDot = ({ ok }) => (
  <span className={`inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0 ${ok ? 'bg-green-400' : 'bg-red-400'}`} />
);

const Dashboard = () => {
  // Событий из event-log-service
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/events/?skip=0&limit=100').then(r => r.data),
    refetchInterval: 10000,
  });

  // Статус ML
  const { data: mlStatus } = useQuery({
    queryKey: ['ml-health'],
    queryFn: () => mlApi.healthCheck().then(r => r.data),
    refetchInterval: 15000,
  });

  // Последние измерения (value = температура или влажность)
  const { data: measurements = [] } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => api.get('/data/measurements/?limit=50').then(r => r.data),
    refetchInterval: 5000,
  });

  // Вычисляем метрики из измерений
  const values = measurements.map(m => m.value).filter(v => v != null);
  const avgValue = values.length
    ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    : null;
  const totalMeasurements = measurements.length;

  const recentEvents = [...events].reverse().slice(0, 6);
  const criticalCount = events.filter(e => e.event_type === 'THRESHOLD_EXCEEDED').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Обзор системы</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Среднее значение"
          value={avgValue}
          unit="°C / %"
          icon={Thermometer}
          color="bg-rose-500"
          sub={`${totalMeasurements} измерений`}
        />
        <MetricCard
          title="Превышений уставки"
          value={criticalCount}
          icon={AlertCircle}
          color={criticalCount > 0 ? "bg-red-500" : "bg-green-500"}
          sub="Из event-log"
        />
        <MetricCard
          title="Событий всего"
          value={events.length}
          icon={Droplets}
          color="bg-blue-500"
          sub="В журнале"
        />
        <MetricCard
          title="ML-сервис"
          value={mlStatus?.model_loaded ? 'Активен' : 'Ожидание'}
          icon={Cpu}
          color={mlStatus?.model_loaded ? "bg-violet-500" : "bg-gray-400"}
          sub={mlStatus?.model_path ?? 'Модель не загружена'}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Последние события</h2>
          <a href="/events" className="text-sm text-indigo-600 hover:underline">Все события →</a>
        </div>

        {eventsLoading ? (
          <div className="text-center py-8 text-gray-400">Загрузка...</div>
        ) : recentEvents.length === 0 ? (
          <div className="flex items-center justify-center py-8 gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">Нет активных событий</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentEvents.map((ev, i) => (
              <div key={i} className="py-3 flex items-start gap-3">
                <StatusDot ok={ev.event_type !== 'THRESHOLD_EXCEEDED'} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{ev.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    {ev.service} · {ev.timestamp ? new Date(ev.timestamp).toLocaleString('ru-RU') : '—'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  ev.event_type === 'THRESHOLD_EXCEEDED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {ev.event_type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;