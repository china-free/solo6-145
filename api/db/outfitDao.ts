import { getDatabase, saveDatabase } from './init';
import { Outfit, OutfitWithClothes, Clothing } from '../../shared/types';
import { getClothingById } from './clothingDao';

function rowToOutfit(row: any): Outfit {
  return {
    id: row.id,
    clothingIds: [],
    date: row.date,
    occasion: row.occasion,
    note: row.note || undefined,
    photoUrl: row.photoUrl || undefined,
    createdAt: row.createdAt,
  };
}

export interface OutfitFilter {
  date?: string;
  month?: string;
  year?: string;
}

export async function getOutfits(filter: OutfitFilter = {}): Promise<OutfitWithClothes[]> {
  const db = getDatabase();
  let sql = 'SELECT * FROM outfit WHERE 1=1';
  const params: any[] = [];

  if (filter.date) {
    sql += ' AND date = ?';
    params.push(filter.date);
  }
  if (filter.month && filter.year) {
    sql += " AND strftime('%Y-%m', date) = ?";
    params.push(`${filter.year}-${filter.month}`);
  }

  sql += ' ORDER BY date DESC';

  const stmt = db.prepare(sql);
  const rows = stmt.getAsObject(params) as any[];

  const outfits: OutfitWithClothes[] = [];
  
  for (const row of Array.isArray(rows) ? rows : []) {
    const outfit = rowToOutfit(row);
    const clothes = await getOutfitClothes(outfit.id);
    outfits.push({
      ...outfit,
      clothes,
    });
  }

  return outfits;
}

export async function getOutfitById(id: number): Promise<OutfitWithClothes | null> {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM outfit WHERE id = ?');
  const row = stmt.getAsObject([id]) as any;

  if (!row) return null;

  const outfit = rowToOutfit(row);
  const clothes = await getOutfitClothes(outfit.id);

  return {
    ...outfit,
    clothes,
  };
}

async function getOutfitClothes(outfitId: number): Promise<Clothing[]> {
  const db = getDatabase();
  const stmt = db.prepare('SELECT clothingId FROM outfit_clothing WHERE outfitId = ?');
  const rows = stmt.getAsObject([outfitId]) as any[];

  const clothes: Clothing[] = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    const clothing = await getClothingById(row.clothingId);
    if (clothing) {
      clothes.push(clothing);
    }
  }

  return clothes;
}

export interface CreateOutfitData {
  clothingIds: number[];
  date: string;
  occasion: string;
  note?: string;
  photoUrl?: string;
}

export async function createOutfit(data: CreateOutfitData): Promise<OutfitWithClothes> {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO outfit (date, occasion, note, photoUrl)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run([data.date, data.occasion, data.note || null, data.photoUrl || null]);
  const outfitId = result.lastInsertRowid as number;

  const linkStmt = db.prepare(`
    INSERT INTO outfit_clothing (outfitId, clothingId)
    VALUES (?, ?)
  `);

  for (const clothingId of data.clothingIds) {
    linkStmt.run([outfitId, clothingId]);
  }

  saveDatabase();

  const outfit = await getOutfitById(outfitId);
  if (!outfit) {
    throw new Error('Failed to create outfit');
  }

  return outfit;
}

export async function deleteOutfit(id: number): Promise<boolean> {
  const db = getDatabase();

  db.prepare('DELETE FROM outfit_clothing WHERE outfitId = ?').run([id]);

  const stmt = db.prepare('DELETE FROM outfit WHERE id = ?');
  const result = stmt.run([id]);

  saveDatabase();

  return (result.changes ?? 0) > 0;
}
