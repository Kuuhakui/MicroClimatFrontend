import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ru } from 'date-fns/locale';
import api, { mlApi } from '../services/api';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Cpu, Clock } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, TimeScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// Диапазоны времени
const RANGES = [
  { label: '1 час',   hours: 1,   unit: 'minute', stepSize: 10 },
  { label: '6 часов', hours: 6,   unit: 'hour',   stepSize: 1  },
  { label: '24 часа', hours: 24,  unit: 'hour',   stepSize: 2  },
  { label: '7 дней',  hours: 168, unit: 'day',    stepSize: 1  },
];

const StatCard = ({ label, value, unit, icon: Icon, color, sub }) => (
  <div className={`rounded-2xl p-4 border ${color} flex flex-col gap-1`}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium opacity-70">{label}</span>
      <Icon size={16} className="opacity-60" />
    </div>
    <div className="flex items-end gap-1 mt-1">
      <span className="text-2xl font-bold">{value ?? '—'}</span>
      {unit && <span className="text-sm opacity-60 mb-0.5">{unit}</span>}
    </div>
    {sub && <span className="text-xs opacity-50">{sub}</span>}
  </div>
);

const Analytics = () => {
  const [rangeIdx, setRangeIdx] = useState(2); // 24 часа по умолчанию
  const range = RANGES[rangeIdx];

  const fromTime = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() - range.hours);
    return d.toISOString();
  }, [rangeIdx]);

  const toTime = useMemo(() => new Date().toISOString(), [rangeIdx]);

  const { data: rawData = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['measurements', rangeIdx],
    queryFn: () =>
      api.get(`/data/measurements/?limit=2000&from_time=${fromTime}&to_time=${toTime}`)
        .then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: mlHealth } = useQuery({
    queryKey: ['ml-health'],
    queryFn: () => mlApi.healthCheck().then(r => r.data),
    staleTime: 60000,
  });

  // Группируем по sensor_id для нескольких линий
  const sensorGroups = useMemo(() => {
    const groups = {};
    rawData.forEach(m => {
      if (!groups[m.sensor_id]) groups[m.sensor_id] = [];
      groups[m.sensor_id].push({ x: new Date(m.measured_at), y: m.value });
    });
    return groups;
  }, [rawData]);

  const COLORS = [
    { border: 'rgb(239, 68, 68)',   bg: 'rgba(239,68,68,0.08)'   },
    { border: 'rgb(59, 130, 246)',  bg: 'rgba(59,130,246,0.08)'  },
    { border: 'rgb(16, 185, 129)', bg: 'rgba(16,185,129,0.08)'  },
  ];

  const SENSOR_NAMES = {
    '11111111-1111-1111-1111-111111111111': 'Комбинированный (T+H)',
    '22222222-2222-2222-2222-222222222222': 'Температура',
    '33333333-3333-3333-3333-333333333333': 'Влажность',
  };

  const chartData = {
    datasets: Object.entries(sensorGroups).map(([sensorId, points], i) => ({
      label: SENSOR_NAMES[sensorId] ?? `Датчик ${sensorId.slice(0, 8)}`,
      data: points,
      borderColor: COLORS[i % COLORS.length].border,
      backgroundColor: COLORS[i % COLORS.length].bg,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: rawData.length > 100 ? 0 : 3,
      pointHoverRadius: 5,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const d = new Date(items[0].parsed.x);
            return d.toLocaleString('ru-RU', {
              day: '2-digit', month: '2-digit',
              hour: '2-digit', minute: '2-digit',
            });
          },
          label: (item) => `${item.dataset.label}: ${item.parsed.y?.toFixed(1)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        adapters: { date: { locale: ru } },
        time: {
          unit: range.unit,
          stepSize: range.stepSize,
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'dd.MM',
          },
        },
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { maxTicksLimit: 12, font: { size: 11 } },
      },
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 11 } },
        title: { display: true, text: 'Значение', font: { size: 11 } },
      },
    },
  };

  // Статистика
  const allValues = rawData.map(m => m.value).filter(v => v != null);
  const avg  = allValues.length ? (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(1) : null;
  const max  = allValues.length ? Math.max(...allValues).toFixed(1) : null;
  const min  = allValues.length ? Math.min(...allValues).toFixed(1) : null;
  const last = rawData.length ? rawData[rawData.length - 1]?.value?.toFixed(1) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {rawData.length} точек · обновляется каждые 30с
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-sm font-medium"
        >
          <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {/* Кнопки диапазона */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {RANGES.map((r, i) => (
          <button
            key={i}
            onClick={() => setRangeIdx(i)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              rangeIdx === i
                ? 'bg-white shadow-sm text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Текущее"
          value={last}
          icon={Activity}
          color="bg-indigo-50 border-indigo-100 text-indigo-900"
        />
        <StatCard
          label="Среднее"
          value={avg}
          icon={TrendingUp}
          color="bg-emerald-50 border-emerald-100 text-emerald-900"
        />
        <StatCard
          label="Максимум"
          value={max}
          icon={TrendingUp}
          color="bg-rose-50 border-rose-100 text-rose-900"
          sub={`за ${range.label}`}
        />
        <StatCard
          label="Минимум"
          value={min}
          icon={TrendingDown}
          color="bg-blue-50 border-blue-100 text-blue-900"
          sub={`за ${range.label}`}
        />
      </div>

      {/* Основной график */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" />
            Показания датчиков — {range.label}
          </h2>
          {mlHealth?.model_loaded && (
            <span className="flex items-center gap-1.5 text-xs text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
              <Cpu size={12} />
              ML активен · {mlHealth.model_path}
            </span>
          )}
        </div>

        <div style={{ height: '420px' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full gap-2 text-gray-400">
              <RefreshCw className="animate-spin" /> Загрузка данных...
            </div>
          ) : rawData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <Activity size={40} className="text-gray-300" />
              <p className="text-sm">Нет данных за выбранный период</p>
              <p className="text-xs text-gray-300">Симулятор пишет данные каждые 5 секунд</p>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Таблица последних значений */}
      {rawData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">Последние 10 измерений</h3>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-2 text-left text-xs text-gray-400 font-medium">Время</th>
                <th className="px-6 py-2 text-left text-xs text-gray-400 font-medium">Датчик</th>
                <th className="px-6 py-2 text-left text-xs text-gray-400 font-medium">Значение</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...rawData].reverse().slice(0, 10).map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5 text-sm text-gray-500">
                    {new Date(m.measured_at).toLocaleString('ru-RU', {
                      day: '2-digit', month: '2-digit',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-2.5 text-sm text-gray-700 font-mono text-xs">
                    {SENSOR_NAMES[m.sensor_id] ?? m.sensor_id?.slice(0, 8)}
                  </td>
                  <td className="px-6 py-2.5 text-sm font-semibold text-indigo-700">
                    {m.value?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;