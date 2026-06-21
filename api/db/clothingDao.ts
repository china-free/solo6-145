import { getDatabase, saveDatabase } from './init';
import { Clothing, ClothingCategory } from '../../shared/types';

function rowToClothing(row: any): Clothing {
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

export interface ClothingFilter {
  category?: ClothingCategory;
  color?: string;
  style?: string;
  season?: string;
  search?: string;
}

export async function getClothes(filter: ClothingFilter = {}): Promise<Clothing[]> {
  const db = getDatabase();
  let sql = `
    SELECT c.*, COUNT(oc.outfitId) AS wearCount
    FROM clothing c
    LEFT JOIN outfit_clothing oc ON c.id = oc.clothingId
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filter.category) {
    sql += ' AND c.category = ?';
    params.push(filter.category);
  }
  if (filter.color) {
    sql += ' AND c.color = ?';
    params.push(filter.color);
  }
  if (filter.style) {
    sql += ' AND c.style LIKE ?';
    params.push(`%${filter.style}%`);
  }
  if (filter.season) {
    sql += ' AND c.season LIKE ?';
    params.push(`%${filter.season}%`);
  }
  if (filter.search) {
    sql += ' AND (c.name LIKE ? OR c.brand LIKE ?)';
    params.push(`%${filter.search}%`, `%${filter.search}%`);
  }

  sql += ' GROUP BY c.id ORDER BY c.createdAt DESC';

  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject(params) as any[];
  
  return Array.isArray(rows) ? rows.map(rowToClothing) : [];
}

export async function getClothingById(id: number): Promise<Clothing | null> {
  const db = getDatabase();
  const sql = `
    SELECT c.*, COUNT(oc.outfitId) AS wearCount
    FROM clothing c
    LEFT JOIN outfit_clothing oc ON c.id = oc.clothingId
    WHERE c.id = ?
    GROUP BY c.id
  `;
  const stmt = db.prepare(sql);
  const row = stmt.getAsObject([id]) as any;
  
  return row ? rowToClothing(row) : null;
}

export interface CreateClothingData {
  name: string;
  category: ClothingCategory;
  color: string;
  style: string[];
  season: string[];
  brand: string;
  purchaseDate: string;
  imageUrl: string;
}

export async function createClothing(data: CreateClothingData): Promise<Clothing> {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO clothing (name, category, color, style, season, brand, purchaseDate, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run([
    data.name,
    data.category,
    data.color,
    JSON.stringify(data.style),
    JSON.stringify(data.season),
    data.brand,
    data.purchaseDate,
    data.imageUrl,
  ]);

  saveDatabase();

  const id = result.lastInsertRowid as number;
  const clothing = await getClothingById(id);
  
  if (!clothing) {
    throw new Error('Failed to create clothing');
  }
  
  return clothing;
}

export async function updateClothing(id: number, data: Partial<CreateClothingData>): Promise<Clothing | null> {
  const db = getDatabase();
  
  const fields: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    params.push(data.name);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    params.push(data.category);
  }
  if (data.color !== undefined) {
    fields.push('color = ?');
    params.push(data.color);
  }
  if (data.style !== undefined) {
    fields.push('style = ?');
    params.push(JSON.stringify(data.style));
  }
  if (data.season !== undefined) {
    fields.push('season = ?');
    params.push(JSON.stringify(data.season));
  }
  if (data.brand !== undefined) {
    fields.push('brand = ?');
    params.push(data.brand);
  }
  if (data.purchaseDate !== undefined) {
    fields.push('purchaseDate = ?');
    params.push(data.purchaseDate);
  }
  if (data.imageUrl !== undefined) {
    fields.push('imageUrl = ?');
    params.push(data.imageUrl);
  }

  if (fields.length === 0) {
    return getClothingById(id);
  }

  params.push(id);

  const stmt = db.prepare(`UPDATE clothing SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(params);

  saveDatabase();

  return getClothingById(id);
}

export async function deleteClothing(id: number): Promise<boolean> {
  const db = getDatabase();
  
  db.prepare('DELETE FROM outfit_clothing WHERE clothingId = ?').run([id]);
  
  const stmt = db.prepare('DELETE FROM clothing WHERE id = ?');
  const result = stmt.run([id]);
  
  saveDatabase();
  
  return (result.changes ?? 0) > 0;
}
