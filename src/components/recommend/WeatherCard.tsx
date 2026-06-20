import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Weather, WeatherCondition } from '../../../shared/types';

interface WeatherCardProps {
  weather: Weather | null;
  loading: boolean;
  onRefresh: () => void;
}

const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
  sunny: <Sun className="w-12 h-12 text-yellow-400" />,
  cloudy: <Cloud className="w-12 h-12 text-gray-400" />,
  rainy: <CloudRain className="w-12 h-12 text-blue-400" />,
  snowy: <Snowflake className="w-12 h-12 text-blue-200" />,
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: '晴天',
  cloudy: '多云',
  rainy: '雨天',
  snowy: '雪天',
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  loading,
  onRefresh,
}) => {
  return (
    <div className="card p-6 bg-gradient-to-br from-sage-50 via-cream-50 to-rose-brown-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-terracotta-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{weather?.city || '获取中...'}</span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 hover:bg-white/50 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-cream-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-24 bg-cream-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-cream-200 rounded animate-pulse" />
            </div>
          </div>
        ) : weather ? (
          <div className="flex items-center gap-6">
            <div className="animate-float">
              {weatherIcons[weather.condition]}
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-gray-800">
                {weather.temperature}°C
              </div>
              <div className="text-gray-500">
                {weatherLabels[weather.condition]}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">获取天气信息失败</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-sm text-rose-brown-500 hover:text-rose-brown-600"
            >
              重试
            </button>
          </div>
        )}

        {weather && (
          <div className="mt-6 pt-4 border-t border-cream-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">体感温度</p>
                <p className="font-semibold text-gray-800">
                  {weather.temperature - 2}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">湿度</p>
                <p className="font-semibold text-gray-800">
                  {weather.condition === 'rainy' ? '85%' : weather.condition === 'snowy' ? '70%' : '55%'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">风力</p>
                <p className="font-semibold text-gray-800">
                  {weather.condition === 'rainy' ? '3-4级' : '2-3级'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
