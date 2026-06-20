export type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'shoes' | 'accessory';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface Clothing {
  id: number;
  name: string;
  category: ClothingCategory;
  color: string;
  style: string[];
  season: string[];
  brand: string;
  purchaseDate: string;
  imageUrl: string;
  wearCount: number;
  createdAt: string;
}

export interface Outfit {
  id: number;
  clothingIds: number[];
  date: string;
  occasion: string;
  note?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface OutfitWithClothes extends Omit<Outfit, 'clothingIds'> {
  clothes: Clothing[];
}

export interface Weather {
  temperature: number;
  condition: WeatherCondition;
  city: string;
}

export interface Recommendation {
  clothes: Clothing[];
  reason: string;
}

export interface WearFrequencyItem {
  clothing: Clothing;
  count: number;
}

export interface SeasonDistributionItem {
  season: string;
  count: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  top: '上装',
  bottom: '下装',
  outerwear: '外套',
  shoes: '鞋子',
  accessory: '配饰',
};

export const CATEGORY_EMOJIS: Record<ClothingCategory, string> = {
  top: '👕',
  bottom: '👖',
  outerwear: '🧥',
  shoes: '👟',
  accessory: '👜',
};

export const STYLE_OPTIONS = ['休闲', '正式', '运动', '复古', '简约', '优雅', '街头', '甜美'];

export const SEASON_OPTIONS = ['春季', '夏季', '秋季', '冬季'];

export const OCCASION_OPTIONS = ['上班', '约会', '运动', '聚会', '旅行', '日常', '正式场合'];

export const COLOR_OPTIONS = [
  { name: '黑色', value: '#000000' },
  { name: '白色', value: '#FFFFFF' },
  { name: '灰色', value: '#808080' },
  { name: '米色', value: '#F5F5DC' },
  { name: '棕色', value: '#8B4513' },
  { name: '红色', value: '#FF0000' },
  { name: '粉色', value: '#FFC0CB' },
  { name: '橙色', value: '#FFA500' },
  { name: '黄色', value: '#FFFF00' },
  { name: '绿色', value: '#008000' },
  { name: '蓝色', value: '#0000FF' },
  { name: '紫色', value: '#800080' },
  { name: '牛仔蓝', value: '#1560BD' },
];
