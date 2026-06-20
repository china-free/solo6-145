import { Router, Request, Response } from 'express';
import { ApiResponse, OutfitWithClothes } from '../../shared/types';
import { getOutfits, getOutfitById, createOutfit, deleteOutfit, OutfitFilter } from '../db/outfitDao';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse<OutfitWithClothes[]>>) => {
  try {
    const filter: OutfitFilter = {};
    
    if (req.query.date) {
      filter.date = req.query.date as string;
    }
    if (req.query.month) {
      filter.month = req.query.month as string;
    }
    if (req.query.year) {
      filter.year = req.query.year as string;
    }

    const outfits = await getOutfits(filter);
    res.json({ data: outfits });
  } catch (error) {
    console.error('Error fetching outfits:', error);
    res.status(500).json({ data: [], message: '获取穿搭列表失败' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<OutfitWithClothes | null>>) => {
  try {
    const id = parseInt(req.params.id);
    const outfit = await getOutfitById(id);
    
    if (!outfit) {
      return res.status(404).json({ data: null, message: '穿搭记录不存在' });
    }
    
    res.json({ data: outfit });
  } catch (error) {
    console.error('Error fetching outfit:', error);
    res.status(500).json({ data: null, message: '获取穿搭详情失败' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<OutfitWithClothes | null>>) => {
  try {
    const { clothingIds, date, occasion, note } = req.body;

    if (!clothingIds || !Array.isArray(clothingIds) || clothingIds.length === 0) {
      return res.status(400).json({ data: null, message: '请至少选择一件衣物' });
    }
    if (!date) {
      return res.status(400).json({ data: null, message: '请选择穿搭日期' });
    }
    if (!occasion) {
      return res.status(400).json({ data: null, message: '请选择场合' });
    }

    const outfit = await createOutfit({
      clothingIds: clothingIds.map(Number),
      date,
      occasion,
      note,
    });

    res.status(201).json({ data: outfit, message: '穿搭记录创建成功' });
  } catch (error) {
    console.error('Error creating outfit:', error);
    res.status(500).json({ data: null, message: '创建穿搭记录失败' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<boolean>>) => {
  try {
    const id = parseInt(req.params.id);
    
    const existing = await getOutfitById(id);
    if (!existing) {
      return res.status(404).json({ data: false, message: '穿搭记录不存在' });
    }

    const success = await deleteOutfit(id);
    res.json({ data: success, message: success ? '删除成功' : '删除失败' });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    res.status(500).json({ data: false, message: '删除穿搭记录失败' });
  }
});

export default router;
