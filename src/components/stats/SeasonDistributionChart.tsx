import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3 } from 'lucide-react';
import { SeasonDistributionItem, SEASON_OPTIONS } from '../../../shared/types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface SeasonDistributionChartProps {
  data: SeasonDistributionItem[];
  loading?: boolean;
}

const SEASON_COLORS: Record<string, string> = {
  '春季': '#86EFAC',
  '夏季': '#FCA5A5',
  '秋季': '#FDBA74',
  '冬季': '#93C5FD',
};

export const SeasonDistributionChart: React.FC<SeasonDistributionChartProps> = ({
  data,
  loading,
}) => {
  const [chartType, setChartType] = React.useState<'doughnut' | 'bar'>('doughnut');

  const sortedData = SEASON_OPTIONS.map((season) => {
    const item = data.find((d) => d.season === season);
    return item || { season, count: 0 };
  });

  const chartData = {
    labels: sortedData.map((d) => d.season),
    datasets: [
      {
        label: '衣物数量',
        data: sortedData.map((d) => d.count),
        backgroundColor: sortedData.map((d) => SEASON_COLORS[d.season] || '#E5E7EB'),
        borderColor: sortedData.map((d) => SEASON_COLORS[d.season] || '#D1D5DB'),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: "'Lato', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#1F2937',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Lato', sans-serif",
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: "'Lato', sans-serif",
          size: 12,
        },
      },
    },
    cutout: '60%',
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#1F2937',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Lato', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          stepSize: 1,
          font: {
            family: "'Lato', sans-serif",
          },
        },
      },
    },
  };

  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-800">季节分布</h3>
          <div className="w-20 h-8 bg-cream-200 rounded-full animate-pulse" />
        </div>
        <div className="aspect-square max-w-sm mx-auto">
          <div className="w-full h-full bg-cream-100 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-rose-brown-500" />
          <h3 className="font-semibold text-gray-800">季节分布</h3>
        </div>
        <div className="flex bg-cream-100 rounded-full p-1">
          <button
            onClick={() => setChartType('doughnut')}
            className={`p-2 rounded-full transition-colors ${
              chartType === 'doughnut'
                ? 'bg-white shadow-soft'
                : 'hover:bg-cream-200'
            }`}
            title="环形图"
          >
            <PieChart className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-full transition-colors ${
              chartType === 'bar'
                ? 'bg-white shadow-soft'
                : 'hover:bg-cream-200'
            }`}
            title="柱状图"
          >
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无数据</p>
        </div>
      ) : (
        <>
          <div className="aspect-square max-w-sm mx-auto">
            {chartType === 'doughnut' ? (
              <Doughnut data={chartData} options={doughnutOptions} />
            ) : (
              <Bar data={chartData} options={barOptions} />
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-6">
            {sortedData.map((item) => (
              <div key={item.season} className="text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: SEASON_COLORS[item.season] }}
                />
                <p className="text-xs text-gray-600">{item.season}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {item.count}
                  <span className="text-gray-400 text-xs ml-1">
                    ({totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0}%)
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
