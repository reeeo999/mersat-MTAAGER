'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserPlus, Search, Palette, ShoppingCart,
  Megaphone, BarChart3, Cog, Anchor, Sparkles, ChevronLeft
} from 'lucide-react';
import clsx from 'clsx';

const modules = [
  { href: '/', label: 'الرئيسية', icon: LayoutDashboard, color: 'text-gold-400' },
  { href: '/onboarding', label: 'استلام العميل', icon: UserPlus, color: 'text-emerald-400' },
  { href: '/intelligence', label: 'مختبر الاستخبارات', icon: Search, color: 'text-sky-400' },
  { href: '/creative', label: 'استوديو الإبداع', icon: Palette, color: 'text-pink-400' },
  { href: '/store', label: 'المتجر التقني', icon: ShoppingCart, color: 'text-amber-400' },
  { href: '/ads', label: 'غرفة الإعلانات', icon: Megaphone, color: 'text-rose-400' },
  { href: '/analytics', label: 'مركز التحليلات', icon: BarChart3, color: 'text-violet-400' },
  { href: '/automation', label: 'محرك الأتمتة', icon: Cog, color: 'text-teal-400' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-ink-950/80 border-l border-white/5 backdrop-blur-xl z-40 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition">
            <Anchor className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-black text-white leading-none">مِرسَاة</div>
            <div className="text-[10px] text-ink-200 tracking-widest mt-0.5">MERSAT</div>
          </div>
        </Link>
      </div>

      {/* Modules nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10px] uppercase tracking-widest text-ink-200 px-3 mb-2">الوحدات</div>
        <ul className="space-y-1">
          {modules.map((m) => {
            const active = pathname === m.href || (m.href !== '/' && pathname.startsWith(m.href));
            const Icon = m.icon;
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                    active
                      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                      : 'text-ink-100 hover:bg-white/5 border border-transparent'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', active ? 'text-gold-400' : m.color)} />
                  <span className="flex-1">{m.label}</span>
                  {active && <ChevronLeft className="w-3 h-3" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 mx-2 p-4 rounded-xl bg-gradient-to-br from-teal-900/30 to-gold-400/5 border border-teal-700/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-bold text-gold-400">ذكاء اصطناعي</span>
          </div>
          <p className="text-[11px] text-ink-200 leading-relaxed">
            المنصة تستخدم نماذج AI مجانية (Ollama محلي أو Hugging Face)
          </p>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 text-[10px] text-ink-200">
        <div>v0.1.0 · مجانية بالكامل</div>
        <div className="mt-1">© 2026 MERSAT</div>
      </div>
    </aside>
  );
}
