import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Globe, CheckCircle2, XCircle, AlertCircle, Package, Zap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const clients = await prisma.client.findMany({
    include: { products: true, storeUrl: true as any },
  });

  const allProducts = await prisma.product.findMany({
    include: { client: true },
    take: 30,
  });

  return (
    <>
      <TopBar
        title="🛒 معالج المتجر السريع"
        subtitle="إدارة المنتجات، فحص البيكسل، وتحسين السرعة"
      />
      <div className="p-8 space-y-6">
        {/* Platform cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Shopify', color: 'from-emerald-500 to-emerald-700', status: 'متاح' },
            { name: 'Salla', color: 'from-pink-500 to-pink-700', status: 'متاح' },
            { name: 'Zid', color: 'from-violet-500 to-violet-700', status: 'متاح' },
            { name: 'WooCommerce', color: 'from-purple-500 to-purple-800', status: 'متاح' },
          ].map((p) => (
            <div key={p.name} className="card p-5 card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}>
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-bold text-white">{p.name}</div>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">{p.status}</span>
              </div>
              <button className="btn btn-ghost w-full justify-center mt-3 text-xs">ربط متجر</button>
            </div>
          ))}
        </div>

        {/* Pixel Checker */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">فاحص البيكسل التلقائي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Meta Pixel', icon: '📘', status: 'active' },
              { name: 'TikTok Pixel', icon: '🎵', status: 'active' },
              { name: 'Google Ads', icon: '🔍', status: 'missing' },
              { name: 'GA4', icon: '📊', status: 'warning' },
            ].map((p) => (
              <div key={p.name} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-center gap-3">
                <div className="text-2xl">{p.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {p.status === 'active' && (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">يعمل</span>
                      </>
                    )}
                    {p.status === 'missing' && (
                      <>
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span className="text-rose-400">غير مثبت</span>
                      </>
                    )}
                    {p.status === 'warning' && (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400">يحتاج فحص</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-bold text-white">المنتجات ({allProducts.length})</h2>
            </div>
            <button className="btn btn-primary text-xs">
              + إضافة منتج
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-ink-200 border-b border-white/5">
                  <th className="pb-3 font-medium">المنتج</th>
                  <th className="pb-3 font-medium">العميل</th>
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">السعر</th>
                  <th className="pb-3 font-medium">التكلفة</th>
                  <th className="pb-3 font-medium">الربح</th>
                  <th className="pb-3 font-medium">المخزون</th>
                  <th className="pb-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => {
                  const profit = p.price - (p.cost || 0);
                  const margin = p.price > 0 ? (profit / p.price) * 100 : 0;
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 text-white font-medium">{p.name}</td>
                      <td className="py-3 text-ink-100">{p.client.name}</td>
                      <td className="py-3 text-ink-100 text-xs">{p.sku}</td>
                      <td className="py-3 text-white font-bold">{formatCurrency(p.price, p.currency || 'SAR')}</td>
                      <td className="py-3 text-ink-100">{formatCurrency(p.cost || 0, p.currency || 'SAR')}</td>
                      <td className="py-3">
                        <span className={margin > 50 ? 'text-emerald-400' : margin > 30 ? 'text-amber-400' : 'text-rose-400'}>
                          {formatCurrency(profit, p.currency || 'SAR')} ({margin.toFixed(0)}%)
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={p.stock < 10 ? 'text-rose-400 font-bold' : 'text-ink-100'}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Speed test */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">⚡ فاحص سرعة المتجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: 'متجر الأناقة', score: 87, status: 'ممتاز', color: 'emerald' },
              { name: 'ساعة الجود', score: 62, status: 'يحتاج تحسين', color: 'amber' },
              { name: 'عطور الشرق', score: 91, status: 'ممتاز', color: 'emerald' },
            ].map((s) => (
              <div key={s.name} className="p-4 rounded-lg bg-ink-900/50 border border-white/5">
                <div className="text-sm font-bold text-white mb-2">{s.name}</div>
                <div className={`text-3xl font-black text-${s.color}-400`}>{s.score}</div>
                <div className="text-xs text-ink-200 mt-1">{s.status}</div>
                <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden mt-2">
                  <div className={`h-full bg-${s.color}-400`} style={{ width: `${s.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
