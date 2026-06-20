import { Router, Request, Response } from 'express';
import { ApiResponse, Weather, Recommendation, WeatherCondition } from '../../shared/types';
import { getWeather } from '../services/weatherService';
import { getRecommendations } from '../services/recommendService';

const router = Router();

router.get('/weather', async (req: Request, res: Response<ApiResponse<Weather | null>>) => {
  try {
    const weather = await getWeather();
    res.json({ data: weather });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ data: null, message: '获取天气信息失败' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<Recommendation[]>>) => {
  try {
    const { temperature, condition, occasion } = req.body;

    if (temperature === undefined || temperature === null) {
      return res.status(400).json({ data: [], message: '缺少温度参数' });
    }
    if (!condition) {
      return res.status(400).json({ data: [], message: '缺少天气状况参数' });
    }
    if (!occasion) {
      return res.status(400).json({ data: [], message: '缺少场合参数' });
    }

    const recommendations = await getRecommendations({
      temperature: Number(temperature),
      condition: condition as WeatherCondition,
      occasion,
    });

    res.json({ data: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ data: [], message: '获取推荐失败' });
  }
});

export default router;
