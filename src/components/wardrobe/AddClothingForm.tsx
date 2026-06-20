import React, { useState, useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import {
  ClothingCategory,
  CATEGORY_LABELS,
  STYLE_OPTIONS,
  SEASON_OPTIONS,
  COLOR_OPTIONS,
} from '../../../shared/types';
import { useStore } from '../../store/useStore';

interface AddClothingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddClothingForm: React.FC<AddClothingFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const addClothing = useStore((state) => state.addClothing);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as ClothingCategory | '',
    color: '',
    style: [] as string[],
    season: [] as string[],
    brand: '',
    purchaseDate: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStyleToggle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter((s) => s !== style)
        : [...prev.style, style],
    }));
  };

  const handleSeasonToggle = (season: string) => {
    setFormData((prev) => ({
      ...prev,
      season: prev.season.includes(season)
        ? prev.season.filter((s) => s !== season)
        : [...prev.season, season],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fileInputRef.current?.files?.[0]) {
      setError('请上传衣物照片');
      return;
    }
    if (!formData.name.trim()) {
      setError('请输入衣物名称');
      return;
    }
    if (!formData.category) {
      setError('请选择衣物类别');
      return;
    }
    if (!formData.color) {
      setError('请选择颜色');
      return;
    }
    if (formData.style.length === 0) {
      setError('请至少选择一个风格');
      return;
    }
    if (formData.season.length === 0) {
      setError('请至少选择一个适用季节');
      return;
    }

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('category', formData.category);
    formPayload.append('color', formData.color);
    formPayload.append('style', JSON.stringify(formData.style));
    formPayload.append('season', JSON.stringify(formData.season));
    formPayload.append('brand', formData.brand);
    formPayload.append('purchaseDate', formData.purchaseDate);
    formPayload.append('image', fileInputRef.current.files[0]);

    const result = await addClothing(formPayload);
    if (result) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="label">衣物照片 *</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            previewImage
              ? 'border-transparent'
              : 'border-cream-300 hover:border-rose-brown-300 hover:bg-cream-50'
          }`}
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-64 mx-auto rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-soft hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-cream-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-rose-brown-400" />
              </div>
              <p className="text-gray-600">点击上传衣物照片</p>
              <p className="text-xs text-gray-400">支持 JPG、PNG、GIF、WebP 格式</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div>
        <label className="label">衣物名称 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="例如：白色休闲T恤"
          className="input"
        />
      </div>

      <div>
        <label className="label">衣物类别 *</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, category: key as ClothingCategory }))}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                formData.category === key
                  ? 'bg-rose-brown-400 text-white shadow-soft'
                  : 'bg-cream-50 text-gray-600 hover:bg-cream-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">颜色 *</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color: color.name }))}
              className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                formData.color === color.name
                  ? 'ring-2 ring-offset-2 ring-rose-brown-400 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {formData.color === color.name && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm ${
                    ['白色', '米色', '黄色'].includes(color.name) ? 'text-gray-800' : 'text-white'
                  }`}>✓</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">风格标签 *</label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => handleStyleToggle(style)}
              className={`tag ${formData.style.includes(style) ? 'tag-active' : 'tag-default'}`}
            >
              {style}
              {formData.style.includes(style) && (
                <X className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">适用季节 *</label>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((season) => (
            <button
              key={season}
              type="button"
              onClick={() => handleSeasonToggle(season)}
              className={`tag ${formData.season.includes(season) ? 'tag-active' : 'tag-default'}`}
            >
              {season}
              {formData.season.includes(season) && (
                <X className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">品牌</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
            placeholder="可选"
            className="input"
          />
        </div>
        <div>
          <label className="label">购买日期</label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))}
            className="input"
          />
        </div>
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
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              添加衣物
            </>
          )}
        </button>
      </div>
    </form>
  );
};
