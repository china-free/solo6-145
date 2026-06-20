import React from 'react';
import { Shirt, CalendarCheck, TrendingUp, Award } from 'lucide-react';

interface StatsOverviewProps {
  totalClothes: number;
  totalOutfits: number;
  mostWornCount: number;
  avgWearCount: number;
  loading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalClothes,
  totalOutfits,
  mostWornCount,
  avgWearCount,
  loading,
}) => {
  const stats = [
    {
      title: '衣物总数',
      value: totalClothes,
      unit: '件',
      icon: <Shirt className="w-6 h-6 text-terracotta-500" />,
      bgColor: 'bg-terracotta-50',
      borderColor: 'border-terracotta-200',
    },
    {
      title: '穿搭记录',
      value: totalOutfits,
      unit: '套',
      icon: <CalendarCheck className="w-6 h-6 text-sage-500" />,
      bgColor: 'bg-sage-50',
      borderColor: 'border-sage-200',
    },
    {
      title: '最多穿着',
      value: mostWornCount,
      unit: '次',
      icon: <TrendingUp className="w-6 h-6 text-rose-brown-500" />,
      bgColor: 'bg-rose-brown-50',
      borderColor: 'border-rose-brown-200',
    },
    {
      title: '平均穿着',
      value: avgWearCount,
      unit: '次/件',
      icon: <Award className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-cream-200 rounded-xl mb-4" />
            <div className="h-3 bg-cream-200 rounded w-16 mb-2" />
            <div className="h-8 bg-cream-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`card p-6 border-l-4 ${stat.borderColor} animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
            {stat.icon}
          </div>
          <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-800">
            {stat.value}
            <span className="text-sm font-normal text-gray-400 ml-1">
              {stat.unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};
