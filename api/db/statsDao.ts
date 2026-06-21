import { getDatabase } from './init';
import { Clothing, ClothingCategory, WearFrequencyItem, SeasonDistributionItem } from '../../shared/types';

function rowToClothingWithCount(row: any): Clothing {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ClothingCategory,
    color: row.color,
    style: JSON.parse(row.style),
    season: JSON.parse(row.season),
    brand: row.brand,
    purchaseDate: row.purchaseDate,
    imageUrl: row.imageUrl,
    wearCount: row.wearCount ?? 0,
    createdAt: row.createdAt,
  };
}

export async function getWearFrequency(): Promise<WearFrequencyItem[]> {
  const db = getDatabase();
  const sql = `
    SELECT c.*, COUNT(oc.outfitId) AS wearCount
    FROM clothing c
    LEFT JOIN outfit_clothing oc ON c.id = oc.clothingId
    LEFT JOIN outfit o ON oc.outfitId = o.id
    GROUP BY c.id
    ORDER BY wearCount DESC
  `;
  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject([]) as any[];

  return Array.isArray(rows) ? rows.map((row) => ({
    clothing: rowToClothingWithCount(row),
    count: row.wearCount ?? 0,
  })) : [];
}

export async function getMostWornClothing(limit: number = 5): Promise<WearFrequencyItem[]> {
  const db = getDatabase();
  const sql = `
    SELECT c.*, COUNT(oc.outfitId) AS wearCount
    FROM clothing c
    INNER JOIN outfit_clothing oc ON c.id = oc.clothingId
    INNER JOIN outfit o ON oc.outfitId = o.id
    GROUP BY c.id
    ORDER BY wearCount DESC
    LIMIT ?
  `;
  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject([limit]) as any[];

  return Array.isArray(rows) ? rows.map((row) => ({
    clothing: rowToClothingWithCount(row),
    count: row.wearCount ?? 0,
  })) : [];
}

export async function getLeastWornClothing(limit: number = 5): Promise<WearFrequencyItem[]> {
  const db = getDatabase();
  const sql = `
    SELECT c.*, COUNT(oc.outfitId) AS wearCount
    FROM clothing c
    LEFT JOIN outfit_clothing oc ON c.id = oc.clothingId
    LEFT JOIN outfit o ON oc.outfitId = o.id
    GROUP BY c.id
    ORDER BY wearCount ASC
    LIMIT ?
  `;
  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject([limit]) as any[];

  return Array.isArray(rows) ? rows.map((row) => ({
    clothing: rowToClothingWithCount(row),
    count: row.wearCount ?? 0,
  })) : [];
}

export async function getSeasonDistribution(): Promise<SeasonDistributionItem[]> {
  const db = getDatabase();
  const sql = 'SELECT season FROM clothing';
  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject([]) as any[];

  const seasonCounts: Record<string, number> = {
    '春季': 0,
    '夏季': 0,
    '秋季': 0,
    '冬季': 0,
  };

  for (const row of Array.isArray(rows) ? rows : []) {
    let seasons: string[] = [];
    try {
      seasons = JSON.parse(row.season);
    } catch {
      seasons = [];
    }
    for (const season of seasons) {
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

export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
  const db = getDatabase();
  const sql = `
    SELECT category, COUNT(*) AS count
    FROM clothing
    GROUP BY category
  `;
  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject([]) as any[];

  return Array.isArray(rows) ? rows.map((row) => ({
    category: row.category,
    count: row.count ?? 0,
  })) : [];
}

export async function getTotalWearCount(): Promise<number> {
  const db = getDatabase();
  const sql = 'SELECT COUNT(*) AS total FROM outfit_clothing';
  const stmt = db.prepare(sql);
  const row = stmt.getAsObject([]) as any;

  return row?.total ?? 0;
}
