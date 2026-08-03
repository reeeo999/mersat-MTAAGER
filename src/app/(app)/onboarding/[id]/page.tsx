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
        </div>

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
      </div>
    </>
  );
}
