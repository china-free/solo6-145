import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { OCCASION_OPTIONS } from '../../shared/types';
import { useStore } from '../store/useStore';
import { WeatherCard } from '../components/recommend/WeatherCard';
import { RecommendationCard } from '../components/recommend/RecommendationCard';
import { Empty } from '../components/Empty';

export const Recommend: React.FC = () => {
  const {
    weather,
    recommendations,
    loading,
    clothes,
    fetchWeather,
    fetchRecommendations,
    clearRecommendations,
  } = useStore();

  const [selectedOccasion, setSelectedOccasion] = useState('日常');
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleGenerateRecommendations = async () => {
    if (!weather) return;
    setHasGenerated(true);
    await fetchRecommendations({
      temperature: weather.temperature,
      condition: weather.condition,
      occasion: selectedOccasion,
    });
  };

  const handleRefreshWeather = async () => {
    clearRecommendations();
    setHasGenerated(false);
    await fetchWeather();
  };

  const handleSaveSuccess = () => {
    alert('穿搭已保存到穿搭记录！');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">智能推荐</h1>
        <p className="text-gray-500">根据天气和场合，为你推荐最佳穿搭组合</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <WeatherCard
            weather={weather}
            loading={loading && !weather}
            onRefresh={handleRefreshWeather}
          />

          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-4">选择场合</h3>
            <div className="grid grid-cols-2 gap-2">
              {OCCASION_OPTIONS.map((occasion) => (
                <button
                  key={occasion}
                  onClick={() => setSelectedOccasion(occasion)}
                  className={`tag justify-center py-2 ${
                    selectedOccasion === occasion
                      ? 'tag-active'
                      : 'tag-default'
                  }`}
                >
                  {occasion}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateRecommendations}
            disabled={!weather || loading || clothes.length === 0}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成穿搭推荐
              </>
            )}
          </button>

          {clothes.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              <p>请先在衣橱中添加衣物</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!hasGenerated ? (
            <div className="card p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-brown-100 to-sage-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-12 h-12 text-rose-brown-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                准备好获取穿搭灵感了吗？
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                选择今天的场合，点击生成推荐，AI 将根据当前天气和你的衣橱为你推荐最合适的穿搭组合。
              </p>
              <button
                onClick={handleGenerateRecommendations}
                disabled={!weather || loading || clothes.length === 0}
                className="btn btn-primary"
              >
                <Sparkles className="w-4 h-4" />
                立即生成
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="card p-6 animate-pulse"
                >
                  <div className="h-8 w-32 bg-cream-200 rounded mb-4" />
                  <div className="flex gap-3 mb-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-24 aspect-[3/4] bg-cream-200 rounded-xl"
                      />
                    ))}
                  </div>
                  <div className="h-16 bg-cream-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <Empty
              icon="🤔"
              title="暂无合适的推荐"
              description="你的衣橱中可能缺少适合当前天气和场合的衣物，试试添加更多衣物吧。"
              actionText="刷新天气"
              onAction={handleRefreshWeather}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  为你推荐 {recommendations.length} 套穿搭
                </h3>
                <button
                  onClick={handleGenerateRecommendations}
                  disabled={loading}
                  className="text-sm text-rose-brown-500 hover:text-rose-brown-600 flex items-center gap-1"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  换一批
                </button>
              </div>
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                  index={index}
                  onSave={handleSaveSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
