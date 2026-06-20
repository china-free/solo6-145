import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatsOverview } from '../components/stats/StatsOverview';
import { WearFrequencyRanking } from '../components/stats/WearFrequencyRanking';
import { SeasonDistributionChart } from '../components/stats/SeasonDistributionChart';
import { CategoryStats } from '../components/stats/CategoryStats';
import { Empty } from '../components/Empty';

export const Stats: React.FC = () => {
  const {
    clothes,
    outfits,
    mostWorn,
    leastWorn,
    seasonDistribution,
    categoryStats,
    loading,
    fetchAllStats,
  } = useStore();

  const loadStats = React.useCallback(async () => {
    await fetchAllStats();
  }, [fetchAllStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const totalWearCount = clothes.reduce((sum, c) => sum + c.wearCount, 0);
  const avgWearCount = clothes.length > 0 ? Math.round(totalWearCount / clothes.length) : 0;
  const mostWornCount = mostWorn.length > 0 ? mostWorn[0].count : 0;

  const hasData = clothes.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">统计分析</h1>
          <p className="text-gray-500">了解你的衣橱使用情况和穿搭偏好</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          刷新数据
        </button>
      </div>

      {!hasData && !loading ? (
        <Empty
          icon="📊"
          title="还没有统计数据"
          description="添加衣物并记录穿搭后，这里将展示你的衣橱使用统计。"
          actionText="去添加衣物"
          onAction={() => window.location.href = '/wardrobe'}
        />
      ) : (
        <>
          <StatsOverview
            totalClothes={clothes.length}
            totalOutfits={outfits.length}
            mostWornCount={mostWornCount}
            avgWearCount={avgWearCount}
            loading={loading}
          />

          <div className="mt-8">
            <CategoryStats data={categoryStats} loading={loading} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <SeasonDistributionChart
              data={seasonDistribution}
              loading={loading}
            />

            <div className="space-y-8">
              <WearFrequencyRanking
                items={mostWorn}
                title="穿着最多 TOP 5"
                type="most"
                loading={loading}
              />
              <WearFrequencyRanking
                items={leastWorn}
                title="穿着最少 TOP 5"
                type="least"
                loading={loading}
              />
            </div>
          </div>

          <div className="mt-8">
            <WearFrequencyRanking
              items={mostWorn}
              title="穿着频次排行"
              type="most"
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};
