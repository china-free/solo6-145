import { create } from 'zustand';
import { Clothing, OutfitWithClothes, ClothingCategory, Weather, Recommendation, WearFrequencyItem, SeasonDistributionItem } from '../../shared/types';
import { clothingApi, outfitApi, recommendApi, statsApi } from '../lib/api';

interface AppState {
  clothes: Clothing[];
  outfits: OutfitWithClothes[];
  loading: boolean;
  error: string | null;
  weather: Weather | null;
  recommendations: Recommendation[];
  wearFrequency: WearFrequencyItem[];
  seasonDistribution: SeasonDistributionItem[];
  mostWorn: WearFrequencyItem[];
  leastWorn: WearFrequencyItem[];
  categoryStats: { category: string; count: number }[];
  
  fetchClothes: (filter?: {
    category?: ClothingCategory;
    color?: string;
    style?: string;
    season?: string;
    search?: string;
  }) => Promise<void>;
  
  addClothing: (data: FormData) => Promise<Clothing | null>;
  
  updateClothing: (id: number, data: FormData) => Promise<Clothing | null>;
  
  deleteClothing: (id: number) => Promise<boolean>;
  
  fetchOutfits: (filter?: { date?: string; month?: string; year?: string }) => Promise<void>;
  
  addOutfit: (data: FormData) => Promise<OutfitWithClothes | null>;
  
  deleteOutfit: (id: number) => Promise<boolean>;
  
  fetchWeather: () => Promise<void>;
  
  fetchRecommendations: (data: { temperature: number; condition: string; occasion: string }) => Promise<void>;
  
  fetchWearFrequency: () => Promise<void>;
  fetchSeasonDistribution: () => Promise<void>;
  fetchMostWorn: (limit?: number) => Promise<void>;
  fetchLeastWorn: (limit?: number) => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  fetchAllStats: () => Promise<void>;
  
  setError: (error: string | null) => void;
  
  clearRecommendations: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  clothes: [],
  outfits: [],
  loading: false,
  error: null,
  weather: null,
  recommendations: [],
  wearFrequency: [],
  seasonDistribution: [],
  mostWorn: [],
  leastWorn: [],
  categoryStats: [],

  fetchClothes: async (filter) => {
    set({ loading: true, error: null });
    try {
      const response = await clothingApi.getAll(filter);
      set({ clothes: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  addClothing: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await clothingApi.create(data);
      if (response.data) {
        set((state) => ({
          clothes: [response.data!, ...state.clothes],
          loading: false,
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
      return null;
    }
  },

  updateClothing: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await clothingApi.update(id, data);
      if (response.data) {
        set((state) => ({
          clothes: state.clothes.map((c) => (c.id === id ? response.data! : c)),
          loading: false,
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
      return null;
    }
  },

  deleteClothing: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await clothingApi.delete(id);
      if (response.data) {
        set((state) => ({
          clothes: state.clothes.filter((c) => c.id !== id),
          loading: false,
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
      return false;
    }
  },

  fetchOutfits: async (filter) => {
    set({ loading: true, error: null });
    try {
      const response = await outfitApi.getAll(filter);
      set({ outfits: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  addOutfit: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await outfitApi.create(data);
      if (response.data) {
        set((state) => ({
          outfits: [response.data!, ...state.outfits],
          loading: false,
        }));
        await get().fetchClothes();
      }
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
      return null;
    }
  },

  deleteOutfit: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await outfitApi.delete(id);
      if (response.data) {
        set((state) => ({
          outfits: state.outfits.filter((o) => o.id !== id),
          loading: false,
        }));
      }
      return response.data;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
      return false;
    }
  },

  fetchWeather: async () => {
    set({ loading: true, error: null });
    try {
      const response = await recommendApi.getWeather();
      set({ weather: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchRecommendations: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await recommendApi.getRecommendations(data);
      set({ recommendations: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  setError: (error) => set({ error }),

  clearRecommendations: () => set({ recommendations: [] }),

  fetchWearFrequency: async () => {
    set({ loading: true, error: null });
    try {
      const response = await statsApi.getWearFrequency();
      set({ wearFrequency: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchSeasonDistribution: async () => {
    set({ loading: true, error: null });
    try {
      const response = await statsApi.getSeasonDistribution();
      set({ seasonDistribution: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchMostWorn: async (limit) => {
    set({ loading: true, error: null });
    try {
      const response = await statsApi.getMostWorn(limit);
      set({ mostWorn: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchLeastWorn: async (limit) => {
    set({ loading: true, error: null });
    try {
      const response = await statsApi.getLeastWorn(limit);
      set({ leastWorn: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchCategoryStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await statsApi.getCategoryStats();
      set({ categoryStats: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },

  fetchAllStats: async () => {
    set({ loading: true, error: null });
    try {
      const [wearFreq, seasonDist, mostWorn, leastWorn, catStats] = await Promise.all([
        statsApi.getWearFrequency(),
        statsApi.getSeasonDistribution(),
        statsApi.getMostWorn(5),
        statsApi.getLeastWorn(5),
        statsApi.getCategoryStats(),
      ]);
      set({
        wearFrequency: wearFreq.data,
        seasonDistribution: seasonDist.data,
        mostWorn: mostWorn.data,
        leastWorn: leastWorn.data,
        categoryStats: catStats.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '请求失败', loading: false });
    }
  },
}));
