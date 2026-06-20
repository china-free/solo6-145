import { Clothing, Recommendation, WeatherCondition } from '../../shared/types';
import { getClothes } from '../db/clothingDao';

interface RecommendParams {
  temperature: number;
  condition: WeatherCondition;
  occasion: string;
}

function getSeasonByTemperature(temp: number): string {
  if (temp >= 28) return '夏季';
  if (temp >= 20) return '春秋';
  if (temp >= 10) return '春季';
  if (temp >= 0) return '秋季';
  return '冬季';
}

function getOccasionStyles(occasion: string): string[] {
  const styleMap: Record<string, string[]> = {
    '上班': ['正式', '简约', '优雅'],
    '约会': ['优雅', '甜美', '简约'],
    '运动': ['运动', '休闲'],
    '聚会': ['休闲', '街头', '复古'],
    '旅行': ['休闲', '运动'],
    '日常': ['休闲', '简约', '街头'],
    '正式场合': ['正式', '优雅'],
  };
  return styleMap[occasion] || ['休闲'];
}

function scoreClothing(clothing: Clothing, params: RecommendParams, season: string): number {
  let score = 0;
  const { temperature, condition, occasion } = params;

  const seasonMatch = clothing.season.some(s => 
    s.includes(season) || 
    (season === '春秋' && (s.includes('春') || s.includes('秋')))
  );
  if (seasonMatch) score += 30;

  if (clothing.season.includes('四季')) score += 20;

  if (temperature >= 28) {
    if (['top', 'bottom'].includes(clothing.category)) {
      if (clothing.color !== '黑色') score += 10;
    }
    if (clothing.category === 'outerwear') score -= 20;
  } else if (temperature >= 20) {
    if (clothing.category === 'outerwear') score -= 5;
  } else if (temperature >= 10) {
    if (clothing.category === 'outerwear') score += 15;
  } else if (temperature >= 0) {
    if (clothing.category === 'outerwear') score += 25;
    if (['毛衣', '厚', '加绒'].some(w => clothing.name.includes(w))) score += 10;
  } else {
    if (clothing.category === 'outerwear') score += 35;
    if (clothing.category === 'shoes' && ['靴子', '雪地靴'].some(w => clothing.name.includes(w))) score += 15;
  }

  if (condition === 'rainy' || condition === 'snowy') {
    if (clothing.category === 'shoes' && ['雨靴', '防水'].some(w => clothing.name.includes(w))) score += 20;
    if (clothing.color === '白色') score -= 10;
  }

  const occasionStyles = getOccasionStyles(occasion);
  const styleMatch = clothing.style.some(s => occasionStyles.includes(s));
  if (styleMatch) score += 25;

  score += Math.min(clothing.wearCount * 0.5, 10);

  return score;
}

export async function getRecommendations(params: RecommendParams): Promise<Recommendation[]> {
  const allClothes = await getClothes();
  
  if (allClothes.length === 0) {
    return [];
  }

  const season = getSeasonByTemperature(params.temperature);
  
  const tops = allClothes.filter(c => c.category === 'top');
  const bottoms = allClothes.filter(c => c.category === 'bottom');
  const outerwears = allClothes.filter(c => c.category === 'outerwear');
  const shoes = allClothes.filter(c => c.category === 'shoes');
  const accessories = allClothes.filter(c => c.category === 'accessory');

  const recommendations: Recommendation[] = [];
  const numCombinations = Math.min(3, tops.length * bottoms.length);

  for (let i = 0; i < numCombinations; i++) {
    const combination: Clothing[] = [];
    let totalScore = 0;

    const top = tops[Math.floor(Math.random() * tops.length)];
    if (top) {
      combination.push(top);
      totalScore += scoreClothing(top, params, season);
    }

    const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    if (bottom) {
      combination.push(bottom);
      totalScore += scoreClothing(bottom, params, season);
    }

    if (params.temperature < 20 && outerwears.length > 0) {
      const outerwear = outerwears[Math.floor(Math.random() * outerwears.length)];
      if (outerwear) {
        combination.push(outerwear);
        totalScore += scoreClothing(outerwear, params, season);
      }
    }

    if (shoes.length > 0) {
      const shoe = shoes[Math.floor(Math.random() * shoes.length)];
      if (shoe) {
        combination.push(shoe);
        totalScore += scoreClothing(shoe, params, season);
      }
    }

    if (Math.random() > 0.5 && accessories.length > 0) {
      const accessory = accessories[Math.floor(Math.random() * accessories.length)];
      if (accessory) {
        combination.push(accessory);
        totalScore += scoreClothing(accessory, params, season);
      }
    }

    const reasons: string[] = [];
    reasons.push(`适合${params.occasion}场合`);
    
    if (params.temperature >= 28) {
      reasons.push('轻薄透气，适合炎热天气');
    } else if (params.temperature >= 20) {
      reasons.push('舒适宜人，温度适中');
    } else if (params.temperature >= 10) {
      reasons.push('温暖舒适，应对微凉天气');
    } else if (params.temperature >= 0) {
      reasons.push('保暖有型，抵御寒冷');
    } else {
      reasons.push('超强保暖，应对严寒');
    }

    if (params.condition === 'rainy') {
      reasons.push('考虑了雨天的实用性');
    } else if (params.condition === 'sunny') {
      reasons.push('适合晴朗好天气');
    }

    const existing = recommendations.find(r => 
      r.clothes.length === combination.length &&
      r.clothes.every((c, idx) => c.id === combination[idx]?.id)
    );

    if (!existing && combination.length >= 2) {
      recommendations.push({
        clothes: combination,
        reason: reasons.join('，') + `。搭配评分：${Math.round(totalScore)}分`,
      });
    }
  }

  return recommendations.sort((a, b) => {
    const scoreA = parseInt(a.reason.match(/(\d+)分/)?.[1] || '0');
    const scoreB = parseInt(b.reason.match(/(\d+)分/)?.[1] || '0');
    return scoreB - scoreA;
  }).slice(0, 3);
}
