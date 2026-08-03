import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatCurrency, formatNumber } from '@/lib/utils';
import AnalyticsCharts from './AnalyticsCharts';
import { TrendingUp, Eye, MousePointerClick, ShoppingCart, DollarSign, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const metrics = await prisma.metric.findMany({
    where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    orderBy: { date: 'asc' },
  });

  // تجميع يومي
  const dailyMap = new Map<string, { spend: number; revenue: number; conversions: number; clicks: number; impressions: number }>();
  metrics.forEach(m => {
    const day = m.date.toISOString().split('T')[0];
    const cur = dailyMap.get(day) || { spend: 0, revenue: 0, conversions: 0, clicks: 0, impressions: 0 };
    dailyMap.set(day, {
      spend: cur.spend + m.spend,
      revenue: cur.revenue + m.revenue,
      conversions: cur.conversions + m.conversions,
      clicks: cur.clicks + m.clicks,
      impressions: cur.impressions + m.impressions,
    });
  });

  const dailyData = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({
      date,
      ...v,
      roas: v.spend > 0 ? Number((v.revenue / v.spend).toFixed(2)) : 0,
      ctr: v.impressions > 0 ? Number(((v.clicks / v.impressions) * 100).toFixed(2)) : 0,
      cpa: v.conversions > 0 ? Number((v.spend / v.conversions).toFixed(2)) : 0,
    }));

  // KPIs
  const totalSpend = metrics.reduce((s, m) => s + m.spend, 0);
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
  const totalConversions = metrics.reduce((s, m) => s + m.conversions, 0);
  const totalImpressions = metrics.reduce((s, m) => s + m.impressions, 0);
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

  // تجميع حسب المنصة
  const byPlatform = new Map<string, { spend: number; revenue: number; conversions: number }>();
  metrics.forEach(m => {
    const cur = byPlatform.get(m.platform) || { spend: 0, revenue: 0, conversions: 0 };
    byPlatform.set(m.platform, {
      spend: cur.spend + m.spend,
      revenue: cur.revenue + m.revenue,
      conversions: cur.conversions + m.conversions,
    });
  });

  const platformData = Array.from(byPlatform.entries()).map(([platform, v]) => ({
    platform,
    ...v,
    roas: v.spend > 0 ? Number((v.revenue / v.spend).toFixed(2)) : 0,
  }));

  return (
    <>
      <TopBar
        title="📊 مركز التحليلات الموحد"
        subtitle="كل المنصات في Dashboard واحد"
      />
      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="stat-card">
            <Eye className="w-4 h-4 text-sky-400 mb-2" />
            <div className="text-xs text-ink-200">الظهور</div>
            <div className="stat-value mt-1">{formatNumber(totalImpressions)}</div>
          </div>
          <div className="stat-card">
            <MousePointerClick className="w-4 h-4 text-violet-400 mb-2" />
            <div className="text-xs text-ink-200">النقرات</div>
            <div className="stat-value mt-1">{formatNumber(totalClicks)}</div>
            <div className="text-[10px] text-ink-200 mt-1">CTR: {ctr.toFixed(2)}%</div>
          </div>
          <div className="stat-card">
            <DollarSign className="w-4 h-4 text-amber-400 mb-2" />
            <div className="text-xs text-ink-200">الإنفاق</div>
            <div className="stat-value mt-1">{formatCurrency(totalSpend)}</div>
          </div>
          <div className="stat-card">
            <ShoppingCart className="w-4 h-4 text-emerald-400 mb-2" />
            <div className="text-xs text-ink-200">المبيعات</div>
            <div className="stat-value mt-1">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="stat-card">
            <Target className="w-4 h-4 text-rose-400 mb-2" />
            <div className="text-xs text-ink-200">التحويلات</div>
            <div className="stat-value mt-1">{formatNumber(totalConversions)}</div>
            <div className="text-[10px] text-ink-200 mt-1">CPA: {formatCurrency(cpa)}</div>
          </div>
          <div className="stat-card">
            <TrendingUp className="w-4 h-4 text-gold-400 mb-2" />
            <div className="text-xs text-ink-200">ROAS</div>
            <div className={`stat-value mt-1 ${roas >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {roas.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Charts */}
        <AnalyticsCharts dailyData={dailyData} platformData={platformData} />

        {/* Best/Worst performing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">🏆 أفضل 5 أيام</h3>
            <div className="space-y-2">
              {[...dailyData].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((d, i) => (
                <div key={d.date} className="flex items-center gap-3 p-2 rounded-lg bg-ink-900/50">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-black">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{d.date}</div>
                    <div className="text-xs text-ink-200">{d.conversions} عملية</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-emerald-400">{formatCurrency(d.revenue)}</div>
                    <div className="text-[10px] text-ink-200">ROAS {d.roas}x</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">📉 أضعف 5 أيام</h3>
            <div className="space-y-2">
              {[...dailyData].sort((a, b) => a.revenue - b.revenue).slice(0, 5).map((d, i) => (
                <div key={d.date} className="flex items-center gap-3 p-2 rounded-lg bg-ink-900/50">
                  <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 text-xs font-black">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{d.date}</div>
                    <div className="text-xs text-ink-200">{d.conversions} عملية</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-rose-400">{formatCurrency(d.revenue)}</div>
                    <div className="text-[10px] text-ink-200">ROAS {d.roas}x</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
