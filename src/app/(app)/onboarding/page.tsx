import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Mail, Phone, Globe, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          brandAssets: true,
          campaigns: true,
          products: true,
        },
      },
    },
  });

  const stats = {
    total: clients.length,
    onboarding: clients.filter(c => c.status === 'onboarding').length,
    active: clients.filter(c => c.status === 'active').length,
    avgReadiness: clients.length > 0
      ? Math.round(clients.reduce((s, c) => s + c.readinessScore, 0) / clients.length)
      : 0,
  };

  return (
    <>
      <TopBar
        title="🚪 بوابة الانضمام الذكي"
        subtitle="استلام وإعداد العملاء الجدد بسرعة"
      />

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="text-xs text-ink-200">إجمالي العملاء</div>
            <div className="stat-value mt-1">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">قيد الإعداد</div>
            <div className="stat-value mt-1 text-amber-400">{stats.onboarding}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">نشطون</div>
            <div className="stat-value mt-1 text-emerald-400">{stats.active}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-ink-200">متوسط الجاهزية</div>
            <div className="stat-value mt-1 text-gold-400">{stats.avgReadiness}%</div>
          </div>
        </div>

        {/* Header + New button */}
        <div className="flex items-center justify-between">
          <h2 className="section-title">قائمة العملاء</h2>
          <Link href="/onboarding/new" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            استلام عميل جديد
          </Link>
        </div>

        {/* Clients grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client) => {
            const statusConfig = {
              onboarding: { label: 'قيد الإعداد', color: 'badge-warning', icon: Clock },
              active: { label: 'نشط', color: 'badge-success', icon: CheckCircle2 },
              paused: { label: 'موقوف', color: 'badge-info', icon: AlertCircle },
              churned: { label: 'خاسر', color: 'badge-danger', icon: AlertCircle },
            }[client.status as 'onboarding' | 'active' | 'paused' | 'churned'];
            const Icon = statusConfig.icon;
            const ready = client.readinessScore;
            const readyColor = ready >= 80 ? 'text-emerald-400' : ready >= 60 ? 'text-amber-400' : 'text-rose-400';

            return (
              <Link
                key={client.id}
                href={`/onboarding/${client.id}`}
                className="card p-5 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                      style={{ backgroundColor: client.brandColor || '#0F766E' }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{client.name}</div>
                      <div className="text-xs text-ink-200">{client.niche || 'بدون تصنيف'}</div>
                    </div>
                  </div>
                  <span className={`badge ${statusConfig.color}`}>
                    <Icon className="w-3 h-3" />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Readiness */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-ink-200">جاهزية العميل</span>
                    <span className={`font-black ${readyColor}`}>{ready}%</span>
                  </div>
                  <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        ready >= 80 ? 'bg-emerald-400' :
                        ready >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${ready}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1.5 text-xs text-ink-100">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-ink-200" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-ink-200" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.storeUrl && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-ink-200" />
                      <span className="truncate">{client.storeUrl}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-base font-bold text-white">{client._count.brandAssets}</div>
                    <div className="text-[10px] text-ink-200">أصول</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{client._count.products}</div>
                    <div className="text-[10px] text-ink-200">منتجات</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{client._count.campaigns}</div>
                    <div className="text-[10px] text-ink-200">حملات</div>
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-ink-200 text-left">
                  انضم {formatDate(client.createdAt)}
                </div>
              </Link>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-3">🚪</div>
            <h3 className="text-lg font-bold text-white mb-1">لا يوجد عملاء بعد</h3>
            <p className="text-sm text-ink-200 mb-4">ابدأ بإضافة أول عميل لك</p>
            <Link href="/onboarding/new" className="btn btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              استلام عميل جديد
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
