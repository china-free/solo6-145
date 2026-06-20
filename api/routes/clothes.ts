import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiResponse, Clothing, ClothingCategory } from '../../shared/types';
import {
  getClothes,
  getClothingById,
  createClothing,
  updateClothing,
  deleteClothing,
  ClothingFilter,
} from '../db/clothingDao';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'clothing-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

router.get('/', async (req: Request, res: Response<ApiResponse<Clothing[]>>) => {
  try {
    const filter: ClothingFilter = {};
    
    if (req.query.category) {
      filter.category = req.query.category as ClothingCategory;
    }
    if (req.query.color) {
      filter.color = req.query.color as string;
    }
    if (req.query.style) {
      filter.style = req.query.style as string;
    }
    if (req.query.season) {
      filter.season = req.query.season as string;
    }
    if (req.query.search) {
      filter.search = req.query.search as string;
    }

    const clothes = await getClothes(filter);
    res.json({ data: clothes });
  } catch (error) {
    console.error('Error fetching clothes:', error);
    res.status(500).json({ data: [], message: '获取衣物列表失败' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<Clothing | null>>) => {
  try {
    const id = parseInt(req.params.id);
    const clothing = await getClothingById(id);
    
    if (!clothing) {
      return res.status(404).json({ data: null, message: '衣物不存在' });
    }
    
    res.json({ data: clothing });
  } catch (error) {
    console.error('Error fetching clothing:', error);
    res.status(500).json({ data: null, message: '获取衣物详情失败' });
  }
});

router.post('/', upload.single('image'), async (req: Request, res: Response<ApiResponse<Clothing | null>>) => {
  try {
    const { name, category, color, style, season, brand, purchaseDate } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ data: null, message: '请上传衣物照片' });
    }

    if (!name || !category || !color || !style || !season) {
      return res.status(400).json({ data: null, message: '缺少必填字段' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const clothing = await createClothing({
      name,
      category: category as ClothingCategory,
      color,
      style: Array.isArray(style) ? style : JSON.parse(style),
      season: Array.isArray(season) ? season : JSON.parse(season),
      brand: brand || '',
      purchaseDate: purchaseDate || '',
      imageUrl,
    });

    res.status(201).json({ data: clothing, message: '添加成功' });
  } catch (error) {
    console.error('Error creating clothing:', error);
    res.status(500).json({ data: null, message: '添加衣物失败' });
  }
});

router.put('/:id', upload.single('image'), async (req: Request, res: Response<ApiResponse<Clothing | null>>) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, color, style, season, brand, purchaseDate } = req.body;

    const existing = await getClothingById(id);
    if (!existing) {
      return res.status(404).json({ data: null, message: '衣物不存在' });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category as ClothingCategory;
    if (color !== undefined) updateData.color = color;
    if (style !== undefined) {
      updateData.style = Array.isArray(style) ? style : JSON.parse(style);
    }
    if (season !== undefined) {
      updateData.season = Array.isArray(season) ? season : JSON.parse(season);
    }
    if (brand !== undefined) updateData.brand = brand;
    if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;

    if (req.file) {
      const oldImagePath = path.join(__dirname, '../../public', existing.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const clothing = await updateClothing(id, updateData);
    res.json({ data: clothing, message: '更新成功' });
  } catch (error) {
    console.error('Error updating clothing:', error);
    res.status(500).json({ data: null, message: '更新衣物失败' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<boolean>>) => {
  try {
    const id = parseInt(req.params.id);
    
    const clothing = await getClothingById(id);
    if (!clothing) {
      return res.status(404).json({ data: false, message: '衣物不存在' });
    }

    const imagePath = path.join(__dirname, '../../public', clothing.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    const success = await deleteClothing(id);
    res.json({ data: success, message: success ? '删除成功' : '删除失败' });
  } catch (error) {
    console.error('Error deleting clothing:', error);
    res.status(500).json({ data: false, message: '删除衣物失败' });
  }
});

export default router;
