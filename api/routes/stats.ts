import { Router, Request, Response } from 'express';
import { ApiResponse, WearFrequencyItem, SeasonDistributionItem } from '../../shared/types';
import {
  getWearFrequency,
  getSeasonDistribution,
  getMostWornClothing,
  getLeastWornClothing,
  getCategoryStats,
} from '../db/statsDao';

const router = Router();

router.get('/wear-frequency', async (req: Request, res: Response<ApiResponse<WearFrequencyItem[]>>) => {
  try {
    const data = await getWearFrequency();
    res.json({ data });
  } catch (error) {
    console.error('Error fetching wear frequency:', error);
    res.status(500).json({ data: [], message: '获取穿着频次失败' });
  }
});

router.get('/season-distribution', async (req: Request, res: Response<ApiResponse<SeasonDistributionItem[]>>) => {
  try {
    const data = await getSeasonDistribution();
    res.json({ data });
  } catch (error) {
    console.error('Error fetching season distribution:', error);
    res.status(500).json({ data: [], message: '获取季节分布失败' });
  }
});

router.get('/most-worn', async (req: Request, res: Response<ApiResponse<WearFrequencyItem[]>>) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const data = await getMostWornClothing(limit);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching most worn:', error);
    res.status(500).json({ data: [], message: '获取最常穿衣物失败' });
  }
});

router.get('/least-worn', async (req: Request, res: Response<ApiResponse<WearFrequencyItem[]>>) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const data = await getLeastWornClothing(limit);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching least worn:', error);
    res.status(500).json({ data: [], message: '获取最少穿衣物失败' });
  }
});

router.get('/category-stats', async (req: Request, res: Response<ApiResponse<{ category: string; count: number }[]>>) => {
  try {
    const data = await getCategoryStats();
    res.json({ data });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ data: [], message: '获取分类统计失败' });
  }
});

export default router;
