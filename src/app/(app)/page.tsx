import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Target, Activity,
  AlertTriangle, Sparkles, ArrowLeft, Eye, MousePointerClick,
  ShoppingCart, Zap
} from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const [clients, metrics30d, insights, tasks, campaigns] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.metric.findMany({
      where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      orderBy: { date: 'asc' },
    }),
    prisma.insight.findMany({
      where: { isRead: false },
      orderBy: { priority: 'desc' },
      take: 5,
    }),
    prisma.task.findMany({
      where: { status: { in: ['pending', 'in_progress'] } },
      orderBy: { dueDate: 'asc' },
      take: 8,
      include: { client: true },
    }),
    prisma.campaign.findMany({
      where: { status: 'active' },
      include: { client: true, ads: true },
    }),
  ]);

  // تجميع البيانات
  const totalSpend = metrics30d.reduce((s, m) => s + m.spend, 0);
  const totalRevenue = metrics30d.reduce((s, m) => s + m.revenue, 0);
  const totalConversions = metrics30d.reduce((s, m) => s + m.conversions, 0);
  const totalImpressions = metrics30d.reduce((s, m) => s + m.impressions, 0);
  const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const activeClients = clients.filter(c => c.status === 'active').length;

  // تجميع يومي
  const dailyData = new Map<string, { spend: number; revenue: number; conversions: number }>();
  metrics30d.forEach(m => {
    const day = m.date.toISOString().split('T')[0];
    const existing = dailyData.get(day) || { spend: 0, revenue: 0, conversions: 0 };
    dailyData.set(day, {
      spend: existing.spend + m.spend,
      revenue: existing.revenue + m.revenue,
      conversions: existing.conversions + m.conversions,
    });
  });

  const chartData = Array.from(dailyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14)
    .map(([date, v]) => ({ date, ...v, roas: v.spend > 0 ? v.revenue / v.spend : 0 }));

  return {
    clients,
    insights,
    tasks,
    campaigns,
    kpis: {
      activeClients,
      totalClients: clients.length,
      totalSpend,
      totalRevenue,
      totalConversions,
      totalImpressions,
      overallRoas,
    },
    chartData,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { kpis, clients, insights, tasks, chartData } = data;

  const kpiCards = [
    {
      label: 'العملاء النشطون',
      value: kpis.activeClients,
      sub: `من ${kpis.totalClients} إجمالي`,
      icon: Users,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      label: 'الإنفاق الإعلاني (30 يوم)',
      value: formatCurrency(kpis.totalSpend),
      sub: `${formatNumber(kpis.totalImpressions)} ظهور`,
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'المبيعات المحققة',
      value: formatCurrency(kpis.totalRevenue),
      sub: `${formatNumber(kpis.totalConversions)} عملية`,
      icon: ShoppingCart,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'ROAS الإجمالي',
      value: `${kpis.overallRoas.toFixed(2)}x`,
      sub: kpis.overallRoas >= 3 ? 'أداء ممتاز' : kpis.overallRoas >= 2 ? 'جيد' : 'يحتاج تحسين',
      icon: Target,
      color: kpis.overallRoas >= 3 ? 'text-emerald-400' : 'text-rose-400',
      bg: kpis.overallRoas >= 3 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
    },
  ];

  return (
    <>
      <TopBar
        title="لوحة التحكم الرئيسية"
        subtitle="نظرة شاملة على أداء الوكالة وعملائك"
      />

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="stat-card card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${k.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${k.color}`} />
                  </div>
                </div>
                <div className="stat-value">{k.value}</div>
                <div className="stat-label">{k.label}</div>
                <div className="text-xs text-ink-200 mt-2">{k.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Charts + Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title">أداء آخر 14 يوم</h2>
                <p className="section-subtitle">الإنفاق مقابل المبيعات</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                  <span className="text-ink-100">المبيعات</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-400"></div>
                  <span className="text-ink-100">الإنفاق</span>
                </div>
              </div>
            </div>
            <DashboardCharts data={chartData} />
          </div>

          {/* AI Insights */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h2 className="section-title">رؤى ذكية</h2>
              </div>
              <span className="badge badge-gold">{insights.length}</span>
            </div>

            <div className="space-y-3">
              {insights.length === 0 ? (
                <div className="text-center py-8 text-ink-200 text-sm">
                  لا توجد رؤى جديدة
                </div>
              ) : (
                insights.map((insight) => {
                  const config = {
                    opportunity: { color: 'badge-success', icon: TrendingUp, label: 'فرصة' },
                    warning: { color: 'badge-warning', icon: AlertTriangle, label: 'تحذير' },
                    achievement: { color: 'badge-info', icon: TrendingUp, label: 'إنجاز' },
                    info: { color: 'badge-gold', icon: Sparkles, label: 'معلومة' },
                  }[insight.type as 'opportunity' | 'warning' | 'achievement' | 'info'] || { color: 'badge-info', icon: Sparkles, label: insight.type };
                  const Icon = config.icon;
                  return (
                    <div key={insight.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 hover:border-gold-400/20 transition">
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white mb-1">{insight.title}</div>
                          <p className="text-xs text-ink-100 leading-relaxed">{insight.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Clients + Tasks */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Clients readiness */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">حالة جاهزية العملاء</h2>
              <Link href="/onboarding" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
                عرض الكل <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => {
                const color =
                  client.readinessScore >= 80 ? 'bg-emerald-400' :
                  client.readinessScore >= 60 ? 'bg-amber-400' :
                  'bg-rose-400';
                return (
                  <Link
                    key={client.id}
                    href={`/onboarding/${client.id}`}
                    className="block p-3 rounded-lg bg-ink-900/50 border border-white/5 hover:border-gold-400/20 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: client.brandColor || '#0F766E' }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{client.name}</div>
                          <div className="text-xs text-ink-200">{client.niche}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white">{client.readinessScore}%</div>
                        <div className="text-[10px] text-ink-200">جاهزية</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all`}
                        style={{ width: `${client.readinessScore}%` }}
                      ></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">المهام القادمة</h2>
              <Link href="/automation" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
                عرض الكل <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-ink-200 text-sm">لا توجد مهام</div>
              ) : (
                tasks.map((task) => {
                  const priorityBadge =
                    task.priority === 'high' ? 'badge-danger' :
                    task.priority === 'medium' ? 'badge-warning' :
                    'badge-info';
                  const statusBadge =
                    task.status === 'in_progress' ? 'badge-info' :
                    task.status === 'blocked' ? 'badge-danger' :
                    'badge-gold';
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 hover:border-gold-400/20 transition flex items-start gap-3">
                      <input type="checkbox" className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white truncate">{task.title}</span>
                          <span className={`badge ${priorityBadge}`}>{task.priority}</span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-ink-100 line-clamp-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-ink-200">
                          {task.client && <span>👤 {task.client.name}</span>}
                          {task.dueDate && <span>📅 {timeAgo(task.dueDate)}</span>}
                          {task.category && <span className="badge badge-teal">{task.category}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="section-title mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/onboarding/new', label: 'استلام عميل جديد', icon: Users, color: 'emerald' },
              { href: '/creative?action=ai-copy', label: 'توليد Copy ذكي', icon: Sparkles, color: 'gold' },
              { href: '/intelligence?action=persona', label: 'بناء Persona', icon: Target, color: 'sky' },
              { href: '/ads?action=new', label: 'حملة جديدة', icon: Zap, color: 'rose' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="p-4 rounded-xl bg-ink-900/50 border border-white/5 hover:border-gold-400/30 transition group"
                >
                  <Icon className={`w-5 h-5 text-${a.color}-400 mb-2 group-hover:scale-110 transition`} />
                  <div className="text-sm font-medium text-white">{a.label}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
