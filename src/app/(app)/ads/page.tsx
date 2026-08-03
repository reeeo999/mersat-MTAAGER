import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Megaphone, Plus, TrendingUp, TrendingDown, Pause, Play, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      client: true,
      ads: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSpend = campaigns.reduce((s, c) =>
    s + c.ads.reduce((sum, a) => sum + a.spend, 0), 0
  );
  const totalRevenue = campaigns.reduce((s, c) =>
    s + c.ads.reduce((sum, a) => sum + a.revenue, 0), 0
  );
  const totalRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <>
      <TopBar
        title="📢 غرفة التحكم الإعلانية"
        subtitle="إدارة Meta + TikTok + Google من مكان واحد"
      />
      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="text-xs text-ink-200">حملات نشطة</div>
            <div className="stat-value mt-1 text-rose-400">{activeCampaigns}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">الإنفاق</div>
            <div className="stat-value mt-1 text-amber-400">{formatCurrency(totalSpend)}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">الإيرادات</div>
            <div className="stat-value mt-1 text-emerald-400">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">ROAS</div>
            <div className={`stat-value mt-1 ${totalRoas >= 3 ? 'text-emerald-400' : totalRoas >= 2 ? 'text-amber-400' : 'text-rose-400'}`}>
              {totalRoas.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">الحملات الإعلانية</h2>
            </div>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" />
              حملة جديدة
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map((c) => {
              const spend = c.ads.reduce((s, a) => s + a.spend, 0);
              const revenue = c.ads.reduce((s, a) => s + a.revenue, 0);
              const roas = spend > 0 ? revenue / spend : 0;
              const conversions = c.ads.reduce((s, a) => s + a.conversions, 0);
              const impressions = c.ads.reduce((s, a) => s + a.impressions, 0);
              const platformIcon = c.platform === 'meta' ? '📘' : c.platform === 'tiktok' ? '🎵' : '🔍';
              const statusBadge = {
                active: 'badge-success',
                paused: 'badge-warning',
                completed: 'badge-info',
                draft: 'badge-gold',
              }[c.status] || 'badge-info';

              return (
                <div key={c.id} className="p-4 rounded-lg bg-ink-900/50 border border-white/5 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{platformIcon}</div>
                      <div>
                        <div className="text-sm font-bold text-white">{c.name}</div>
                        <div className="text-xs text-ink-200">
                          {c.client.name} · {c.objective} · {c.ads.length} إعلان
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${statusBadge}`}>
                        {c.status === 'active' ? 'نشط' : c.status === 'paused' ? 'موقوف' : c.status}
                      </span>
                      {c.status === 'active' ? (
                        <button className="btn btn-ghost text-xs">
                          <Pause className="w-3 h-3" />
                        </button>
                      ) : (
                        <button className="btn btn-ghost text-xs">
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <div className="text-[10px] text-ink-200">الميزانية اليومية</div>
                      <div className="text-sm font-bold text-white">{formatCurrency(c.dailyBudget)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-200">الإنفاق</div>
                      <div className="text-sm font-bold text-amber-400">{formatCurrency(spend)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-200">المبيعات</div>
                      <div className="text-sm font-bold text-emerald-400">{formatCurrency(revenue)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-200">ROAS</div>
                      <div className={`text-sm font-bold flex items-center gap-1 ${
                        roas >= 3 ? 'text-emerald-400' : roas >= 2 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {roas >= 2 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {roas.toFixed(2)}x
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-200">التحويلات</div>
                      <div className="text-sm font-bold text-white">{conversions}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-6 border-gold-400/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">توصيات ذكية</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-400 mb-1">فرصة Scaling</div>
                  <p className="text-xs text-ink-100">
                    إعلان "حقيبة جلد" يحقق ROAS 5.8x. زِد الميزانية اليومية 40%.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-amber-400 mb-1">Creative Fatigue</div>
                  <p className="text-xs text-ink-100">
                    إعلان "عطر الورد" بدأ يفقد أداءه. جدد الكريتيف خلال 48 ساعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
