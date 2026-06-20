import React, { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { Clothing, OCCASION_OPTIONS, CATEGORY_LABELS } from '../../../shared/types';
import { useStore } from '../../store/useStore';
import { ClothingCard } from '../wardrobe/ClothingCard';

interface CreateOutfitFormProps {
  initialDate?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateOutfitForm: React.FC<CreateOutfitFormProps> = ({
  initialDate,
  onSuccess,
  onCancel,
}) => {
  const { clothes, fetchClothes, addOutfit, loading, error, setError } = useStore();
  const [selectedClothes, setSelectedClothes] = useState<Clothing[]>([]);
  const [formData, setFormData] = useState({
    date: initialDate || new Date().toISOString().split('T')[0],
    occasion: '',
    note: '',
  });
  const [filterCategory, setFilterCategory] = useState('');

  const loadClothes = useCallback(() => {
    fetchClothes();
  }, [fetchClothes]);

  useEffect(() => {
    loadClothes();
  }, [loadClothes]);

  const toggleClothing = (clothing: Clothing) => {
    setSelectedClothes((prev) => {
      const exists = prev.find((c) => c.id === clothing.id);
      if (exists) {
        return prev.filter((c) => c.id !== clothing.id);
      }
      return [...prev, clothing];
    });
  };

  const removeClothing = (clothingId: number) => {
    setSelectedClothes((prev) => prev.filter((c) => c.id !== clothingId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedClothes.length === 0) {
      setError('请至少选择一件衣物');
      return;
    }
    if (!formData.date) {
      setError('请选择穿搭日期');
      return;
    }
    if (!formData.occasion) {
      setError('请选择场合');
      return;
    }

    const result = await addOutfit({
      clothingIds: selectedClothes.map((c) => c.id),
      date: formData.date,
      occasion: formData.occasion,
      note: formData.note,
    });

    if (result) {
      onSuccess?.();
    }
  };

  const filteredClothes = filterCategory
    ? clothes.filter((c) => c.category === filterCategory)
    : clothes;

  const getSelectedByCategory = (category: string) => {
    return selectedClothes.filter((c) => c.category === category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">穿搭日期 *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="input"
          />
        </div>
        <div>
          <label className="label">场合 *</label>
          <select
            value={formData.occasion}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, occasion: e.target.value }))
            }
            className="input"
          >
            <option value="">选择场合</option>
            {OCCASION_OPTIONS.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">备注</label>
        <textarea
          value={formData.note}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
          placeholder="记录一下今天的穿搭心得..."
          rows={3}
          className="input resize-none"
        />
      </div>

      {selectedClothes.length > 0 && (
        <div className="card p-4 bg-cream-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-800">
              已选择 {selectedClothes.length} 件衣物
            </h4>
            <button
              type="button"
              onClick={() => setSelectedClothes([])}
              className="text-sm text-rose-brown-500 hover:text-rose-brown-600"
            >
              清空
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
              const items = getSelectedByCategory(category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{label}:</span>
                  <div className="flex -space-x-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => removeClothing(item.id)}
                        className="relative group"
                      >
                        <img
                          src={`http://localhost:3001${item.imageUrl}`}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">选择衣物 *</label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setFilterCategory('')}
              className={`text-xs px-2 py-1 rounded-full ${
                !filterCategory
                  ? 'bg-rose-brown-400 text-white'
                  : 'bg-cream-100 text-gray-600'
              }`}
            >
              全部
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterCategory(key)}
                className={`text-xs px-2 py-1 rounded-full ${
                  filterCategory === key
                    ? 'bg-rose-brown-400 text-white'
                    : 'bg-cream-100 text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {clothes.length === 0 ? (
          <div className="text-center py-8 bg-cream-50 rounded-xl">
            <p className="text-gray-500">衣橱里还没有衣物，先去添加几件吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2">
            {filteredClothes.map((clothing) => (
              <ClothingCard
                key={clothing.id}
                clothing={clothing}
                selectable
                selected={selectedClothes.some((c) => c.id === clothing.id)}
                onSelect={toggleClothing}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex-1"
          disabled={loading}
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={loading || clothes.length === 0}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              保存穿搭
            </>
          )}
        </button>
      </div>
    </form>
  );
};
