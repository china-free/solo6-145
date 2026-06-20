import { Weather, WeatherCondition } from '../../shared/types';

export async function getWeather(): Promise<Weather> {
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'snowy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const month = new Date().getMonth();
  let baseTemp = 20;
  
  if (month >= 5 && month <= 7) {
    baseTemp = 28 + Math.random() * 8;
  } else if (month >= 11 || month <= 1) {
    baseTemp = -5 + Math.random() * 10;
  } else if (month >= 2 && month <= 4) {
    baseTemp = 15 + Math.random() * 10;
  } else {
    baseTemp = 18 + Math.random() * 8;
  }

  const temperature = Math.round(baseTemp * 10) / 10;

  return {
    temperature,
    condition: randomCondition,
    city: '北京',
  };
}
