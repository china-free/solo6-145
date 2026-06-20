import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Calendar } from '../components/outfit/Calendar';
import { CreateOutfitForm } from '../components/outfit/CreateOutfitForm';
import { Modal } from '../components/ui/Modal';
import { OutfitWithClothes } from '../../shared/types';

export const Outfits: React.FC = () => {
  const { outfits, loading, fetchOutfits, deleteOutfit } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<OutfitWithClothes | null>(null);

  const loadOutfits = React.useCallback(async () => {
    await fetchOutfits({
      month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
      year: currentDate.getFullYear().toString(),
    });
  }, [currentDate, fetchOutfits]);

  useEffect(() => {
    loadOutfits();
  }, [loadOutfits]);

  const handleDateClick = (date: string) => {
    const outfitForDate = outfits.find((o) => o.date === date);
    if (outfitForDate) {
      setShowDetailModal(outfitForDate);
    } else {
      setSelectedDate(date);
      setShowCreateModal(true);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadOutfits();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这条穿搭记录吗？')) {
      await deleteOutfit(id);
      setShowDetailModal(null);
      loadOutfits();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const todayOutfit = outfits.find(
    (o) => o.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">穿搭记录</h1>
          <p className="text-gray-500">本月记录了 {outfits.length} 套穿搭</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(undefined);
            setShowCreateModal(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus className="w-4 h-4" />
          记录穿搭
        </button>
      </div>

      {todayOutfit && (
        <div className="card p-6 mb-8 bg-gradient-to-r from-rose-brown-50 to-sage-50 border-2 border-rose-brown-100">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-rose-brown-500" />
            <h3 className="font-semibold text-gray-800">今日穿搭</h3>
          </div>
          {todayOutfit.photoUrl && (
            <div className="mb-4">
              <img
                src={`http://localhost:3001${todayOutfit.photoUrl}`}
                alt="今日穿搭"
                className="w-full max-h-80 object-cover rounded-xl"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            {todayOutfit.clothes.map((clothing) => (
              <div
                key={clothing.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-soft"
              >
                <img
                  src={`http://localhost:3001${clothing.imageUrl}`}
                  alt={clothing.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{clothing.name}</p>
                  <p className="text-sm text-gray-500">{todayOutfit.occasion}</p>
                </div>
              </div>
            ))}
          </div>
          {todayOutfit.note && (
            <p className="mt-4 text-gray-600 italic">"{todayOutfit.note}"</p>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            outfits={outfits}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4">本月穿搭</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-cream-100 rounded-xl p-4 h-20"
                  />
                ))}
              </div>
            ) : outfits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">本月还没有穿搭记录</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-sm text-rose-brown-500 hover:text-rose-brown-600"
                >
                  + 记录第一条穿搭
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setShowDetailModal(outfit)}
                    className="w-full text-left p-3 rounded-xl hover:bg-cream-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {outfit.photoUrl ? (
                        <img
                          src={`http://localhost:3001${outfit.photoUrl}`}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="flex -space-x-2">
                          {outfit.clothes.slice(0, 3).map((clothing) => (
                            <img
                              key={clothing.id}
                              src={`http://localhost:3001${clothing.imageUrl}`}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {outfit.occasion}
                        </p>
                        <p className="text-xs text-gray-500">{outfit.date}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="记录穿搭"
        size="xl"
      >
        <CreateOutfitForm
          initialDate={selectedDate || undefined}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!showDetailModal}
        onClose={() => setShowDetailModal(null)}
        title="穿搭详情"
        size="lg"
      >
        {showDetailModal && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {formatDate(showDetailModal.date)}
                </p>
                <h3 className="text-xl font-semibold text-gray-800">
                  {showDetailModal.occasion}
                </h3>
              </div>
              <span className="tag tag-active">{showDetailModal.occasion}</span>
            </div>

            {showDetailModal.photoUrl && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={`http://localhost:3001${showDetailModal.photoUrl}`}
                  alt="穿搭照片"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {showDetailModal.note && (
              <div className="p-4 bg-cream-50 rounded-xl">
                <p className="text-gray-600 italic">"{showDetailModal.note}"</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-800 mb-3">搭配单品</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {showDetailModal.clothes.map((clothing) => (
                  <div
                    key={clothing.id}
                    className="card overflow-hidden"
                  >
                    <div className="aspect-square">
                      <img
                        src={`http://localhost:3001${clothing.imageUrl}`}
                        alt={clothing.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-800 truncate">
                        {clothing.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        穿过 {clothing.wearCount} 次
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowDetailModal(null)}
                className="btn btn-outline flex-1"
              >
                关闭
              </button>
              <button
                onClick={() => handleDelete(showDetailModal.id)}
                className="btn btn-danger flex-1"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
