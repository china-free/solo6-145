import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Check, X, Camera, Upload, Image as ImageIcon } from 'lucide-react';
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadClothes = useCallback(() => {
    fetchClothes();
  }, [fetchClothes]);

  useEffect(() => {
    loadClothes();
  }, [loadClothes]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('无法访问摄像头，请检查权限设置');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `outfit-${Date.now()}.jpg`, {
              type: 'image/jpeg' });
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(blob));
          }
        }, 'image/jpeg', 0.9);
      }
      stopCamera();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

    const formDataToSend = new FormData();
    formDataToSend.append('clothingIds', JSON.stringify(selectedClothes.map((c) => c.id)));
    formDataToSend.append('date', formData.date);
    formDataToSend.append('occasion', formData.occasion);
    if (formData.note) {
      formDataToSend.append('note', formData.note);
    }
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }

    const result = await addOutfit(formDataToSend);

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

      <div>
        <label className="label">穿搭照片</label>
        <div className="border-2 border-dashed border-cream-200 rounded-2xl p-6 text-center">
          {showCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-80 mx-auto rounded-xl"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="btn btn-primary"
                >
                  <Camera className="w-4 h-4" />
                  拍照
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="btn btn-outline"
                >
                  取消
                </button>
              </div>
            </div>
          ) : photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full max-h-80 mx-auto rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">上传穿搭照片或使用相机拍照记录</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn btn-outline"
                >
                  <Camera className="w-4 h-4" />
                  拍照
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  <Upload className="w-4 h-4" />
                  上传照片
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>
      </div>

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
