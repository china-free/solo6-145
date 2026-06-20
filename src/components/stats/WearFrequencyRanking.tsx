import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { WearFrequencyItem, CATEGORY_LABELS } from '../../../shared/types';

interface WearFrequencyRankingProps {
  items: WearFrequencyItem[];
  title: string;
  type: 'most' | 'least';
  loading?: boolean;
}

export const WearFrequencyRanking: React.FC<WearFrequencyRankingProps> = ({
  items,
  title,
  type,
  loading,
}) => {
  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 animate-pulse"
            >
              <div className="w-8 h-8 bg-cream-200 rounded-full" />
              <div className="w-12 h-12 bg-cream-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-1/2" />
              </div>
              <div className="w-12 h-6 bg-cream-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        {type === 'most' ? (
          <TrendingUp className="w-5 h-5 text-terracotta-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-sage-500" />
        )}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.clothing.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream-50 transition-colors group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  type === 'most'
                    ? index === 0
                      ? 'bg-terracotta-100 text-terracotta-600'
                      : index === 1
                      ? 'bg-terracotta-50 text-terracotta-500'
                      : index === 2
                      ? 'bg-rose-brown-50 text-rose-brown-500'
                      : 'bg-cream-100 text-gray-500'
                    : 'bg-sage-50 text-sage-600'
                }`}
              >
                {index + 1}
              </div>

              <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                <img
                  src={`http://localhost:3001${item.clothing.imageUrl}`}
                  alt={item.clothing.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {item.clothing.name}
                </p>
                <p className="text-sm text-gray-500">
                  {getCategoryLabel(item.clothing.category)} · {item.clothing.brand}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span
                  className={`badge ${
                    type === 'most'
                      ? 'bg-terracotta-100 text-terracotta-600'
                      : 'bg-sage-100 text-sage-600'
                  }`}
                >
                  {item.count} 次
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
