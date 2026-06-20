import { WearFrequencyItem, SeasonDistributionItem } from '../../shared/types';
import { getClothes } from './clothingDao';

export async function getWearFrequency(): Promise<WearFrequencyItem[]> {
  const clothes = await getClothes();
  
  return clothes
    .map(clothing => ({
      clothing,
      count: clothing.wearCount,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getSeasonDistribution(): Promise<SeasonDistributionItem[]> {
  const clothes = await getClothes();
  const seasonCounts: Record<string, number> = {
    '春季': 0,
    '夏季': 0,
    '秋季': 0,
    '冬季': 0,
  };

  for (const clothing of clothes) {
    for (const season of clothing.season) {
      if (seasonCounts[season] !== undefined) {
        seasonCounts[season]++;
      }
    }
  }

  return Object.entries(seasonCounts).map(([season, count]) => ({
    season,
    count,
  }));
}

export async function getMostWornClothing(limit: number = 5): Promise<WearFrequencyItem[]> {
  const frequency = await getWearFrequency();
  return frequency.filter(item => item.count > 0).slice(0, limit);
}

export async function getLeastWornClothing(limit: number = 5): Promise<WearFrequencyItem[]> {
  const frequency = await getWearFrequency();
  return frequency
    .filter(item => item.count > 0)
    .reverse()
    .slice(0, limit);
}

export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
  const clothes = await getClothes();
  const categoryCounts: Record<string, number> = {};

  for (const clothing of clothes) {
    categoryCounts[clothing.category] = (categoryCounts[clothing.category] || 0) + 1;
  }

  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));
}
