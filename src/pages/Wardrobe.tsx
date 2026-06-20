import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import {
  ClothingCategory,
  CATEGORY_LABELS,
  SEASON_OPTIONS,
  STYLE_OPTIONS,
  COLOR_OPTIONS,
} from '../../shared/types';
import { useStore } from '../store/useStore';
import { ClothingCard } from '../components/wardrobe/ClothingCard';
import { AddClothingForm } from '../components/wardrobe/AddClothingForm';
import { Modal } from '../components/ui/Modal';

export const Wardrobe: React.FC = () => {
  const { clothes, loading, fetchClothes } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '' as ClothingCategory | '',
    color: '',
    style: '',
    season: '',
  });

  const loadClothes = React.useCallback(async () => {
    const filterObj: Record<string, string> = {};
    if (filters.category) filterObj.category = filters.category;
    if (filters.color) filterObj.color = filters.color;
    if (filters.style) filterObj.style = filters.style;
    if (filters.season) filterObj.season = filters.season;
    if (searchQuery) filterObj.search = searchQuery;
    
    await fetchClothes(filterObj);
  }, [filters, searchQuery, fetchClothes]);

  useEffect(() => {
    loadClothes();
  }, [loadClothes]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      color: '',
      style: '',
      season: '',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || searchQuery;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">我的衣橱</h1>
          <p className="text-gray-500">共 {clothes.length} 件衣物</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-outline btn-sm ${
              hasActiveFilters ? 'bg-rose-brown-100 text-rose-brown-600' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            筛选
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-rose-brown-500 text-white rounded-full text-xs flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4" />
            添加衣物
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索衣物名称或品牌..."
            className="input pl-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-cream-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6">
        <button
          onClick={() => handleFilterChange('category', '')}
          className={`tag whitespace-nowrap ${
            !filters.category ? 'tag-active' : 'tag-default'
          }`}
        >
          全部
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleFilterChange('category', key)}
            className={`tag whitespace-nowrap ${
              filters.category === key ? 'tag-active' : 'tag-default'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="card p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">高级筛选</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-rose-brown-500 hover:text-rose-brown-600"
            >
              清除全部
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">颜色</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleFilterChange('color', color.name)}
                    className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                      filters.color === color.name
                        ? 'ring-2 ring-offset-2 ring-rose-brown-400 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {filters.color === color.name && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">风格</label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleFilterChange('style', style)}
                    className={`tag ${filters.style === style ? 'tag-active' : 'tag-default'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">季节</label>
              <div className="flex flex-wrap gap-2">
                {SEASON_OPTIONS.map((season) => (
                  <button
                    key={season}
                    onClick={() => handleFilterChange('season', season)}
                    className={`tag ${filters.season === season ? 'tag-active' : 'tag-default'}`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="card overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-cream-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : clothes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto bg-cream-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">👕</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {hasActiveFilters ? '没有找到匹配的衣物' : '衣橱还是空的'}
          </h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters
              ? '试试调整筛选条件'
              : '点击上方按钮添加你的第一件衣物吧'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              添加衣物
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {clothes.map((clothing) => (
            <ClothingCard
              key={clothing.id}
              clothing={clothing}
              onDelete={loadClothes}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加衣物"
        size="lg"
      >
        <AddClothingForm
          onSuccess={() => {
            setShowAddModal(false);
            loadClothes();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};
