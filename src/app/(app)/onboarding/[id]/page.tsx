import TopBar from '@/components/TopBar';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { Package, Store, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const clients = await prisma.client.findMany({
    include: {
      products: true,
    },
  });

  const allProducts = await prisma.product.findMany({
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <TopBar
        title="إدارة المتاجر والمنتجات"
        subtitle="استعراض المتاجر المرتبطة والمنتجات النشطة"
      />

      <div className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-bold text-white">المتاجر المسجلة ({clients.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div key={client.id} className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: client.brandColor || '#0F766E' }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{client.name}</h3>
                      <span className="text-xs text-ink-200">{client.niche || 'بدون تصنيف'}</span>
                    </div>
                  </div>
                  <span className={`badge ${client.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {client.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-ink-200 pt-2 border-t border-white/5">
                  <span>📦 {client.products.length} منتج</span>
                  {client.storeUrl && (
                    <a
                      href={client.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-400 hover:underline flex items-center gap-1"
                    >
                      زيارة المتجر <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">جميع المنتجات ({allProducts.length})</h2>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-ink-900/50 text-xs text-ink-200">
                    <th className="p-4">المنتج</th>
                    <th className="p-4">المتجر</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">المخزون</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {allProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-ink-200">
                        لا توجد منتجات مسجلة حالياً
                      </td>
                    </tr>
                  ) : (
                    allProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-bold text-white">{product.name}</td>
                        <td className="p-4 text-ink-100">{product.client?.name || '—'}</td>
                        <td className="p-4">
                          <span className="badge badge-info">{product.category || 'عام'}</span>
                        </td>
                        <td className="p-4 text-emerald-400 font-bold">{formatCurrency(product.price)}</td>
                        <td className="p-4 text-ink-200">{product.stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
