import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Clothing, CATEGORY_LABELS, CATEGORY_EMOJIS } from '../../../shared/types';
import { useStore } from '../../store/useStore';
import { Modal } from '../ui/Modal';

interface ClothingCardProps {
  clothing: Clothing;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (clothing: Clothing) => void;
  onDelete?: () => void;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({
  clothing,
  selectable = false,
  selected = false,
  onSelect,
  onDelete,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const deleteClothing = useStore((state) => state.deleteClothing);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这件衣物吗？')) {
      await deleteClothing(clothing.id);
      onDelete?.();
    }
  };

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(clothing);
    } else {
      setShowDetail(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`card card-hover overflow-hidden cursor-pointer group relative ${
          selected ? 'ring-2 ring-rose-brown-400' : ''
        }`}
      >
        {selected && (
          <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-rose-brown-400 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        <div className="aspect-[3/4] bg-cream-100 relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cream-300 border-t-rose-brown-400 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={`http://localhost:3001${clothing.imageUrl}`}
            alt={clothing.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${!selectable ? 'group-hover:scale-105' : ''}`}
            onLoad={() => setImageLoaded(true)}
          />

          {!selectable && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="p-2 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-800 truncate">{clothing.name}</h3>
            <span className="text-lg" title={CATEGORY_LABELS[clothing.category]}>
              {CATEGORY_EMOJIS[clothing.category]}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: clothing.color }}
              title={clothing.color}
            />
            <div className="flex flex-wrap gap-1">
              {clothing.style.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="text-xs px-1.5 py-0.5 bg-cream-100 text-gray-600 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>穿过 {clothing.wearCount} 次</span>
            {clothing.brand && <span className="truncate">{clothing.brand}</span>}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="衣物详情"
        size="md"
      >
        <div className="space-y-4">
          <div className="aspect-video rounded-xl overflow-hidden bg-cream-100">
            <img
              src={`http://localhost:3001${clothing.imageUrl}`}
              alt={clothing.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">{clothing.name}</h3>
            <p className="text-gray-500 mt-1">
              {CATEGORY_EMOJIS[clothing.category]} {CATEGORY_LABELS[clothing.category]}
              {clothing.brand && ` · ${clothing.brand}`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-500">颜色</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: clothing.color }}
                />
                <span className="text-gray-800">{clothing.color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-500">穿着次数</label>
              <p className="text-gray-800">{clothing.wearCount} 次</p>
            </div>

            {clothing.purchaseDate && (
              <div className="space-y-1">
                <label className="text-sm text-gray-500">购买日期</label>
                <p className="text-gray-800">{clothing.purchaseDate}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500">风格</label>
            <div className="flex flex-wrap gap-2">
              {clothing.style.map((s) => (
                <span key={s} className="tag tag-default">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500">适用季节</label>
            <div className="flex flex-wrap gap-2">
              {clothing.season.map((s) => (
                <span key={s} className="tag tag-default">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowDetail(false)} className="btn btn-outline flex-1">
              关闭
            </button>
            <button onClick={handleDelete} className="btn btn-danger flex-1">
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
