'use client';

import { useState, useTransition } from 'react';
import { createClient } from './actions';
import { CheckCircle2, AlertCircle, Save, Sparkles } from 'lucide-react';

export default function NewClientForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    storeUrl: '',
    niche: '',
    brandColor: '#0F766E',
    monthlyBudget: '',
    notes: '',
  });

  // حساب الجاهزية في الوقت الحقيقي
  let liveScore = 30;
  if (form.email) liveScore += 10;
  if (form.phone) liveScore += 10;
  if (form.storeUrl) liveScore += 15;
  if (form.niche) liveScore += 10;
  if (form.brandColor) liveScore += 5;
  if (form.monthlyBudget) liveScore += 10;
  if (form.notes) liveScore += 10;
  liveScore = Math.min(liveScore, 100);

  const scoreColor =
    liveScore >= 80 ? 'text-emerald-400' :
    liveScore >= 60 ? 'text-amber-400' : 'text-rose-400';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createClient({
        ...form,
        monthlyBudget: form.monthlyBudget ? Number(form.monthlyBudget) : undefined,
      });
    });
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">البيانات الأساسية</h3>

          <div>
            <label className="label">اسم العميل / المتجر *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="input"
              placeholder="مثال: متجر الأناقة الفاخرة"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="label">رقم الجوال</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input"
                placeholder="+9665XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="label">رابط المتجر</label>
            <input
              type="url"
              value={form.storeUrl}
              onChange={(e) => update('storeUrl', e.target.value)}
              className="input"
              placeholder="https://store.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">النيتش / التصنيف</label>
              <select
                value={form.niche}
                onChange={(e) => update('niche', e.target.value)}
                className="input"
              >
                <option value="">اختر...</option>
                <option value="أزياء">أزياء</option>
                <option value="عطور">عطور</option>
                <option value="مستحضرات جمال">مستحضرات جمال</option>
                <option value="إلكترونيات">إلكترونيات</option>
                <option value="أطعمة ومشروبات">أطعمة ومشروبات</option>
                <option value="معدات رياضية">معدات رياضية</option>
                <option value="أثاث وديكور">أثاث وديكور</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
            <div>
              <label className="label">الميزانية الشهرية (ر.س)</label>
              <input
                type="number"
                value={form.monthlyBudget}
                onChange={(e) => update('monthlyBudget', e.target.value)}
                className="input"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label className="label">لون البراند</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brandColor}
                onChange={(e) => update('brandColor', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={form.brandColor}
                onChange={(e) => update('brandColor', e.target.value)}
                className="input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="label">ملاحظات</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="input min-h-[80px]"
              placeholder="أي معلومات إضافية مهمة عن العميل..."
            />
          </div>
        </div>

        {/* Checklist reminder */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-3">⚠️ قائمة ما سيُطلب لاحقاً</h3>
          <ul className="space-y-2 text-sm text-ink-100">
            {[
              'لوجو البراند (PNG/SVG بدقة عالية)',
              'صور المنتجات (5+ صور لكل منتج)',
              'دخول لـ Meta Business Manager',
              'دخول لـ Google Analytics 4',
              'دخول لـ Shopify / Salla / Zid',
              'بيانات الدخول للوحة المتجر',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar - Live Score */}
      <div className="space-y-4">
        <div className="card p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-white">مؤشر الجاهزية</h3>
          </div>

          <div className="text-center my-6">
            <div className={`text-5xl font-black ${scoreColor}`}>{liveScore}%</div>
            <div className="text-xs text-ink-200 mt-1">
              {liveScore >= 80 ? 'ممتاز - جاهز للإطلاق' : liveScore >= 60 ? 'جيد - يحتاج بعض البيانات' : 'يحتاج معلومات إضافية'}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'الاسم', done: !!form.name },
              { label: 'البريد', done: !!form.email, points: 10 },
              { label: 'الجوال', done: !!form.phone, points: 10 },
              { label: 'رابط المتجر', done: !!form.storeUrl, points: 15 },
              { label: 'النيتش', done: !!form.niche, points: 10 },
              { label: 'اللون', done: !!form.brandColor, points: 5 },
              { label: 'الميزانية', done: !!form.monthlyBudget, points: 10 },
              { label: 'ملاحظات', done: !!form.notes, points: 10 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-ink-200" />
                  )}
                  <span className={item.done ? 'text-ink-100' : 'text-ink-200'}>
                    {item.label}
                  </span>
                </span>
                {item.points && <span className="text-ink-200">+{item.points}</span>}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending || !form.name || !form.email}
            className="btn btn-primary w-full justify-center mt-6 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? 'جاري الحفظ...' : 'استلام العميل'}
          </button>
        </div>
      </div>
    </form>
  );
}
