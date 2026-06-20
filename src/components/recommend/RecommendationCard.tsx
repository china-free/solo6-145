import React from 'react';
import { Sparkles, Save } from 'lucide-react';
import { Recommendation, CATEGORY_LABELS } from '../../../shared/types';
import { useStore } from '../../store/useStore';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  onSave?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  onSave,
}) => {
  const { addOutfit, clothes } = useStore();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (recommendation.clothes.length === 0) return;
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('clothingIds', JSON.stringify(recommendation.clothes.map((c) => c.id)));
      formData.append('date', new Date().toISOString().split('T')[0]);
      formData.append('occasion', '日常');
      formData.append('note', recommendation.reason);
      
      await addOutfit(formData);
      onSave?.();
    } finally {
      setSaving(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
  };

  return (
    <div className="card p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-terracotta-300 to-rose-brown-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800">推荐 {index + 1}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || clothes.length === 0}
          className="btn btn-outline btn-sm"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-rose-brown-300 border-t-rose-brown-500 rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              保存
            </>
          )}
        </button>
      </div>

      <div className="flex gap-3 mb-4 overflow-x-auto hide-scrollbar pb-2">
        {recommendation.clothes.map((clothing) => (
          <div
            key={clothing.id}
            className="flex-shrink-0 w-24"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-cream-100 mb-2">
              <img
                src={`http://localhost:3001${clothing.imageUrl}`}
                alt={clothing.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-medium text-gray-800 truncate">
              {clothing.name}
            </p>
            <p className="text-xs text-gray-500">
              {getCategoryLabel(clothing.category)}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 bg-sage-50 rounded-xl">
        <p className="text-sm text-gray-600 leading-relaxed">
          {recommendation.reason}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {recommendation.clothes.map((clothing) => (
          <span
            key={clothing.id}
            className="tag tag-default text-xs"
          >
            {clothing.style[0]}
          </span>
        ))}
      </div>
    </div>
  );
};
