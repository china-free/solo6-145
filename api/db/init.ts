import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const DB_PATH = path.join(__dirname, '../../data/wardrobe.db');
const DB_DIR = path.dirname(DB_PATH);

export async function initDatabase(): Promise<Database> {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => path.join(__dirname, '../../node_modules/sql.js/dist', file),
    });
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  createTables(db);

  saveDatabase();

  return db;
}

function createTables(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS clothing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('top', 'bottom', 'outerwear', 'shoes', 'accessory')),
      color TEXT NOT NULL,
      style TEXT NOT NULL,
      season TEXT NOT NULL,
      brand TEXT,
      purchaseDate TEXT,
      imageUrl TEXT NOT NULL,
      wearCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS outfit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      occasion TEXT NOT NULL,
      note TEXT,
      photoUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    db.run('ALTER TABLE outfit ADD COLUMN photoUrl TEXT');
  } catch {
    // Column might already exist, ignore
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS outfit_clothing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      outfitId INTEGER NOT NULL,
      clothingId INTEGER NOT NULL,
      FOREIGN KEY (outfitId) REFERENCES outfit(id) ON DELETE CASCADE,
      FOREIGN KEY (clothingId) REFERENCES clothing(id) ON DELETE CASCADE
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_clothing_category ON clothing(category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_outfit_date ON outfit(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_outfit_clothing_outfit ON outfit_clothing(outfitId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_outfit_clothing_clothing ON outfit_clothing(clothingId)`);
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  
  const data = db.export();
  const buffer = Buffer.from(data);
  
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  
  fs.writeFileSync(DB_PATH, buffer);
}
