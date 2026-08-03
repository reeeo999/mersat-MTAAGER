import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';
import { ArrowRight, Mail, Phone, Globe, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock, Package, Megaphone, Users, BarChart3, FileText, Target } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      brandAssets: true,
      personas: true,
      competitors: true,
      products: true,
      campaigns: { include: { ads: true } },
      tasks: { orderBy: { dueDate: 'asc' } },
      contracts: true,
      metrics: { orderBy: { date: 'desc' }, take: 30 },
    },
  });

  if (!client) notFound();

  const totalSpend = client.metrics.reduce((s, m) => s + m.spend, 0);
  const totalRevenue = client.metrics.reduce((s, m) => s + m.revenue, 0);
  const totalConversions = client.metrics.reduce((s, m) => s + m.conversions, 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  return (
    <>
      <TopBar
        title={client.name}
        subtitle={client.niche || 'بدون تصنيف'}
      />

      <div className="p-8 space-y-6">
        {/* Back link + Header card */}
        <div className="flex items-center gap-2 text-sm text-ink-200">
          <Link href="/onboarding" className="hover:text-gold-400 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            العودة للعملاء
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
              style={{ backgroundColor: client.brandColor || '#0F766E' }}
            >
              {client.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-black text-white">{client.name}</h1>
              <div className="flex items-center gap-3 text-sm text-ink-200 mt-1 flex-wrap">
                {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>}
                {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>}
                {client.storeUrl && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {client.storeUrl}</span>}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-ink-200">جاهزية العميل</div>
              <div className={`text-3xl font-black ${
                client.readinessScore >= 80 ? 'text-emerald-400' :
                client.readinessScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {client.readinessScore}%
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="mt-4 p-3 rounded-lg bg-ink-900/50 border border-white/5 text-sm text-ink-100">
              💬 {client.notes}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <DollarSign className="w-4 h-4 text-amber-400 mb-2" />
            <div className="text-xs text-ink-200">الميزانية الشهرية</div>
            <div className="stat-value mt-1">{client.monthlyBudget ? formatCurrency(client.monthlyBudget) : '—'}</div>
          </div>
          <div className="stat-card">
            <BarChart3 className="w-4 h-4 text-emerald-400 mb-2" />
            <div className="text-xs text-ink-200">إيرادات 30 يوم</div>
            <div className="stat-value mt-1">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="stat-card">
            <Target className="w-4 h-4 text-rose-400 mb-2" />
            <div className="text-xs text-ink-200">ROAS</div>
            <div className={`stat-value mt-1 ${roas >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {roas.toFixed(2)}x
            </div>
          </div>
          <div className="stat-card">
            <Package className="w-4 h-4 text-sky-400 mb-2" />
            <div className="text-xs text-ink-200">منتجات</div>
            <div className="stat-value mt-1">{client.products.length}</div>
          </div>
        </div>

        {/* Tabs sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">مهام العميل ({client.tasks.length})</h2>
            </div>
            <div className="space-y-2">
              {client.tasks.length === 0 ? (
                <div className="text-sm text-ink-200 text-center py-4">لا توجد مهام</div>
              ) : (
                client.tasks.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-ink-900/50">
                    <input type="checkbox" defaultChecked={t.status === 'done'} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm text-white">{t.title}</div>
                      {t.dueDate && <div className="text-[10px] text-ink-200">📅 {formatDate(t.dueDate)}</div>}
                    </div>
                    <span className={`badge ${
                      t.priority === 'high' ? 'badge-danger' :
                      t.priority === 'medium' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Brand Assets */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">أصول البراند ({client.brandAssets.length})</h2>
            </div>
            <div className="space-y-2">
              {client.brandAssets.length === 0 ? (
                <div className="text-sm text-ink-200 text-center py-4">لا توجد أصول بعد</div>
              ) : (
                client.brandAssets.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {a.type === 'logo' ? '🖼' : a.type === 'video' ? '🎬' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{a.name}</div>
                      <div className="text-xs text-ink-200">{a.sizeKb} KB</div>
                    </div>
                    <span className={`badge ${
                      a.quality === 'high' ? 'badge-success' :
                      a.quality === 'medium' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {a.quality === 'high' ? 'HD' : a.quality === 'medium' ? 'متوسط' : 'ضعيف'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Campaigns */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">الحملات ({client.campaigns.length})</h2>
            </div>
            <div className="space-y-2">
              {client.campaigns.map((c) => {
                const spend = c.ads.reduce((s, a) => s + a.spend, 0);
                return (
                  <div key={c.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-center gap-3">
                    <div className="text-2xl">{c.platform === 'meta' ? '📘' : c.platform === 'tiktok' ? '🎵' : '🔍'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{c.name}</div>
                      <div className="text-xs text-ink-200">{c.ads.length} إعلان · {formatCurrency(spend)}</div>
                    </div>
                    <span className={`badge ${
                      c.status === 'active' ? 'badge-success' :
                      c.status === 'paused' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personas + Competitors */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white">الشخصيات والمنافسين</h2>
            </div>
            <div className="space-y-2 mb-3">
              {client.personas.map((p) => (
                <div key={p.id} className="p-2 rounded-lg bg-ink-900/50 text-sm">
                  <div className="font-bold text-white">👤 {p.name}</div>
                  <div className="text-xs text-ink-200">{p.ageRange} · {p.location}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {client.competitors.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-ink-900/50 text-sm flex items-center gap-2">
                  <div className="font-bold text-white">🎯 {c.name}</div>
                  <span className="text-xs text-ink-200 mr-auto">قوة: {c.strengthScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
