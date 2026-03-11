import React, { useState, useEffect } from 'react';
import { coreApi, mlApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [mlStatus, setMlStatus] = useState('offline');
  const [settings, setSettings] = useState({
    defaultTemperatureThreshold: 24,
    defaultHumidityThreshold: 60,
    alertEmailEnabled: false,
    alertPushEnabled: false,
    mlModelActive: 'xgboost_office_baseline_v1',
  });

  // 1. Загрузка данных при входе на страницу
  useEffect(() => {
  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Используем Promise.allSettled, чтобы если один сервис лежит, остальные загрузились
      const results = await Promise.allSettled([
        coreApi.getAllThresholds(),
        coreApi.getAllFeatures(),
        mlApi.healthCheck()
      ]);

      // Безопасно разбираем результаты
      const [thresholdsRes, featuresRes, mlRes] = results;

      if (thresholdsRes.status === 'fulfilled') {
        const data = thresholdsRes.value.data;
        setSettings(prev => ({
          ...prev,
          // Используем опциональную цепочку ?. и дефолтные значения ??
          defaultTemperatureThreshold: data?.temperature?.[0]?.max_value ?? 25,
          defaultHumidityThreshold: data?.humidity?.[0]?.max_value ?? 65,
        }));
      }

      if (featuresRes.status === 'fulfilled') {
        const flags = featuresRes.value.data;
        setSettings(prev => ({
          ...prev,
          alertEmailEnabled: flags?.enable_mobile_notifications ?? false,
          alertPushEnabled: flags?.enable_realtime_prediction ?? false,
        }));
      }

      setMlStatus(mlRes.status === 'fulfilled' ? 'online' : 'offline');

    } catch (error) {
      console.error("Критическая ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSettings();
}, []);

  // 2. Сохранение данных
  const handleSave = async () => {
    try {
      // Отправляем данные в Core Service
      await Promise.all([
        coreApi.updateThreshold('temperature', {
          sensor_type: 'temperature',
          min_value: 18,
          max_value: settings.defaultTemperatureThreshold
        }),
        coreApi.updateFeature('enable_mobile_notifications', settings.alertEmailEnabled),
        coreApi.updateModelConfig({
          model_id: settings.mlModelActive,
          version: "v1.0",
          is_active: true
        })
      ]);

      alert('Настройки успешно синхронизированы с Core Service!');
    } catch (error) {
      alert('Ошибка при сохранении. Проверьте логи шлюза.');
    }
  };

  if (loading) return <div className="p-6">Загрузка системных параметров...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Системные настройки</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Пороги */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Глобальные уставки</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Порог температуры (°C)
              </label>
              <input
                type="number"
                value={settings.defaultTemperatureThreshold}
                onChange={(e) => setSettings({ ...settings, defaultTemperatureThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Влажность аналогично... */}
          </div>
        </div>

        {/* Конфигурация ML */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">ML Модель</h3>
          <select
            value={settings.mlModelActive}
            onChange={(e) => setSettings({ ...settings, mlModelActive: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="xgboost_office_baseline_v1">XGBoost Office Baseline v1</option>
            <option value="xgboost_final_5y">XGBoost Final 5Y</option>
          </select>
          
          <div className="mt-6 flex items-center space-x-2">
            <StatusBadge status={mlStatus} />
            <span className="text-sm font-medium">
              ML Service: {mlStatus === 'online' ? 'Подключен' : 'Недоступен'}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Порт назначения: 8005 (через Gateway)</p>
        </div>
      </div>

      {/* Уведомления */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Уведомления (Feature Flags)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email оповещения</span>
            <input 
              type="checkbox" 
              checked={settings.alertEmailEnabled} 
              onChange={(e) => setSettings({...settings, alertEmailEnabled: e.target.checked})}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-md">
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default Settings;