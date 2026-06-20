import {
  Clothing,
  OutfitWithClothes,
  Weather,
  Recommendation,
  WearFrequencyItem,
  SeasonDistributionItem,
  ApiResponse,
  ClothingCategory,
} from '../../shared/types';

const API_BASE = 'http://localhost:3001/api';

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

export const clothingApi = {
  getAll: (filter?: {
    category?: ClothingCategory;
    color?: string;
    style?: string;
    season?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.color) params.append('color', filter.color);
    if (filter?.style) params.append('style', filter.style);
    if (filter?.season) params.append('season', filter.season);
    if (filter?.search) params.append('search', filter.search);
    
    const query = params.toString();
    return request<ApiResponse<Clothing[]>>(
      `/clothes${query ? `?${query}` : ''}`
    );
  },

  getById: (id: number) =>
    request<ApiResponse<Clothing | null>>(`/clothes/${id}`),

  create: (data: FormData) =>
    request<ApiResponse<Clothing | null>>('/clothes', {
      method: 'POST',
      body: data,
      headers: {},
    }),

  update: (id: number, data: FormData) =>
    request<ApiResponse<Clothing | null>>(`/clothes/${id}`, {
      method: 'PUT',
      body: data,
      headers: {},
    }),

  delete: (id: number) =>
    request<ApiResponse<boolean>>(`/clothes/${id}`, {
      method: 'DELETE',
    }),
};

export const outfitApi = {
  getAll: (filter?: { date?: string; month?: string; year?: string }) => {
    const params = new URLSearchParams();
    if (filter?.date) params.append('date', filter.date);
    if (filter?.month) params.append('month', filter.month);
    if (filter?.year) params.append('year', filter.year);
    
    const query = params.toString();
    return request<ApiResponse<OutfitWithClothes[]>>(
      `/outfits${query ? `?${query}` : ''}`
    );
  },

  getById: (id: number) =>
    request<ApiResponse<OutfitWithClothes | null>>(`/outfits/${id}`),

  create: (data: FormData) =>
    request<ApiResponse<OutfitWithClothes | null>>('/outfits', {
      method: 'POST',
      body: data,
      headers: {},
    }),

  delete: (id: number) =>
    request<ApiResponse<boolean>>(`/outfits/${id}`, {
      method: 'DELETE',
    }),
};

export const recommendApi = {
  getWeather: () =>
    request<ApiResponse<Weather | null>>('/recommend/weather'),

  getRecommendations: (data: { temperature: number; condition: string; occasion: string }) =>
    request<ApiResponse<Recommendation[]>>('/recommend', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const statsApi = {
  getWearFrequency: () =>
    request<ApiResponse<WearFrequencyItem[]>>('/stats/wear-frequency'),

  getSeasonDistribution: () =>
    request<ApiResponse<SeasonDistributionItem[]>>('/stats/season-distribution'),

  getMostWorn: (limit?: number) =>
    request<ApiResponse<WearFrequencyItem[]>>(
      `/stats/most-worn${limit ? `?limit=${limit}` : ''}`
    ),

  getLeastWorn: (limit?: number) =>
    request<ApiResponse<WearFrequencyItem[]>>(
      `/stats/least-worn${limit ? `?limit=${limit}` : ''}`
    ),

  getCategoryStats: () =>
    request<ApiResponse<{ category: string; count: number }[]>>('/stats/category-stats'),
};
