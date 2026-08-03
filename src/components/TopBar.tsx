'use client';

import { Bell, Search, User } from 'lucide-react';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-ink-950/60 border-b border-white/5">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{title}</h1>
          {subtitle && <p className="text-sm text-ink-200 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-200" />
            <input
              type="search"
              placeholder="بحث سريع..."
              className="bg-ink-900 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-sm text-white placeholder:text-ink-200 focus:border-gold-400/50 focus:outline-none w-64"
            />
          </div>
          <button className="relative w-9 h-9 rounded-lg bg-ink-900 border border-white/10 hover:border-gold-400/30 flex items-center justify-center transition">
            <Bell className="w-4 h-4 text-ink-100" />
            <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-gold-400"></span>
          </button>
          <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center">
            <User className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </header>
  );
}
