import React from 'react';
import { Layers } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '../../../shared/types';

interface CategoryStatsProps {
  data: { category: string; count: number }[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  top: 'bg-terracotta-100 text-terracotta-600',
  bottom: 'bg-sage-100 text-sage-600',
  outerwear: 'bg-rose-brown-100 text-rose-brown-600',
  shoes: 'bg-blue-100 text-blue-600',
  accessory: 'bg-purple-100 text-purple-600',
};

export const CategoryStats: React.FC<CategoryStatsProps> = ({ data, loading }) => {
  const sortedCategories = Object.keys(CATEGORY_LABELS).map((cat) => {
    const item = data.find((d) => d.category === cat);
    return {
      category: cat,
      count: item?.count || 0,
    };
  });

  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-sage-500" />
          <h3 className="font-semibold text-gray-800">分类统计</h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="w-12 h-12 bg-cream-200 rounded-full mx-auto mb-2" />
              <div className="h-3 bg-cream-200 rounded w-12 mx-auto mb-1" />
              <div className="h-4 bg-cream-200 rounded w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5 text-sage-500" />
        <h3 className="font-semibold text-gray-800">分类统计</h3>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {sortedCategories.map((item) => (
            <div
              key={item.category}
              className="text-center p-4 rounded-xl hover:bg-cream-50 transition-colors group"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 transition-transform group-hover:scale-110 ${
                  CATEGORY_COLORS[item.category] || 'bg-cream-100 text-gray-600'
                }`}
              >
                {CATEGORY_EMOJIS[item.category as keyof typeof CATEGORY_EMOJIS]}
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]}
              </p>
              <p className="text-xl font-bold text-gray-800">{item.count}</p>
              <p className="text-xs text-gray-400">
                {totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
