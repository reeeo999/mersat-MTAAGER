'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Wand2, Copy, Check, Image as ImageIcon, Video, FileText, Layers } from 'lucide-react';
import { generateAI, AI_PROMPTS } from '@/lib/ai';
import { timeAgo } from '@/lib/utils';

interface Content {
  id: string; title: string; body: string | null; type: string; platform: string | null;
  status: string; clientName: string; aiGenerated: boolean; createdAt: string;
}
interface ClientOpt { id: string; name: string; niche: string | null; }
interface Template { id: string; name: string; category: string; platform: string | null; }
interface AIStatus { ollama: boolean; openrouter: boolean; huggingface: boolean; }

interface Props {
  contents: Content[];
  clients: ClientOpt[];
  templates: Template[];
  aiStatus: AIStatus;
}

export default function CreativeStudio({ contents, clients, templates, aiStatus }: Props) {
  const [tab, setTab] = useState<'generate' | 'library' | 'templates'>('generate');

  // Generate form
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('نساء 25-40');
  const [platform, setPlatform] = useState('meta');
  const [tone, setTone] = useState('حماسي');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ headline: string; body: string; cta: string }[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const aiAvailable = aiStatus.ollama || aiStatus.openrouter || aiStatus.huggingface;

  const handleGenerate = async () => {
    if (!product) return alert('أدخل اسم المنتج');
    setLoading(true);
    setGenerated([]);

    const p = AI_PROMPTS.adCopy(product, audience, platform, tone);
    const out = await generateAI(p.system, p.user, { temperature: 0.9 });

    try {
      // محاولة استخراج JSON من النتيجة
      const jsonMatch = out.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          setGenerated(parsed);
        }
      } else {
        // Fallback: قسّم النص
        setGenerated([{ headline: 'النتيجة النصية', body: out, cta: '' }]);
      }
    } catch {
      setGenerated([{ headline: 'النتيجة', body: out, cta: '' }]);
    }

    setLoading(false);
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Status */}
      {!aiAvailable && (
        <div className="card p-4 border-amber-500/20 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div className="text-sm text-amber-400">
            ⚠️ الذكاء الاصطناعي غير مفعّل. أضف OLLAMA_URL أو OPENROUTER_API_KEY في .env للحصول على توليد Copy ذكي.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'generate', label: 'توليد Copy بالـ AI', icon: Sparkles },
          { id: 'library', label: `المكتبة (${contents.length})`, icon: Layers },
          { id: 'templates', label: `القوالب (${templates.length})`, icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'generate' | 'library' | 'templates')}
              className={`btn ${tab === t.id ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30' : 'btn-ghost'}`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Generate Tab */}
      {tab === 'generate' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-gold-400" />
              <h3 className="font-bold text-white">مولّد الإعلانات الذكي</h3>
            </div>

            <div>
              <label className="label">المنتج *</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="input"
                placeholder="مثال: فستان سهرة فاخر"
              />
            </div>

            <div>
              <label className="label">الجمهور المستهدف</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">المنصة</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
                <option value="meta">Meta (Facebook + Instagram)</option>
                <option value="tiktok">TikTok</option>
                <option value="google">Google Ads</option>
                <option value="snapchat">Snapchat</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>

            <div>
              <label className="label">الأسلوب / اللهجة</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="input">
                <option value="حماسي">حماسي</option>
                <option value="فاخر">فاخر وراقي</option>
                <option value="عاجل">عاجل (urgency)</option>
                <option value="ودود">ودود وقريب</option>
                <option value="احترافي">احترافي</option>
                <option value="فكاهي">فكاهي</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !aiAvailable}
              className="btn btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  ولّد 5 نسخ إعلانات
                </>
              )}
            </button>
          </div>

          <div className="xl:col-span-2 space-y-3">
            {generated.length === 0 ? (
              <div className="card p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gold-400/30" />
                <h3 className="text-lg font-bold text-white mb-1">جاهز للتوليد</h3>
                <p className="text-sm text-ink-200">املأ البيانات واضغط "ولّد 5 نسخ إعلانات"</p>
              </div>
            ) : (
              generated.map((g, idx) => (
                <div key={idx} className="card p-5 card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-gold">نسخة #{idx + 1}</span>
                    <button
                      onClick={() => copyText(`${g.headline}\n\n${g.body}\n\n${g.cta}`, idx)}
                      className="btn btn-ghost text-xs"
                    >
                      {copied === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> نسخ
                        </>
                      )}
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{g.headline}</h3>
                  <p className="text-sm text-ink-100 mb-3 whitespace-pre-wrap leading-relaxed">{g.body}</p>
                  {g.cta && (
                    <div className="inline-block px-3 py-1.5 rounded-lg bg-gold-400/10 text-gold-400 text-sm font-bold border border-gold-400/20">
                      👉 {g.cta}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Library */}
      {tab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {contents.map((c) => {
            const Icon = c.type === 'video' ? Video : c.type === 'image' ? ImageIcon : FileText;
            const statusBadge = {
              draft: 'badge-gold',
              in_review: 'badge-warning',
              approved: 'badge-success',
              rejected: 'badge-danger',
              live: 'badge-teal',
            }[c.status] || 'badge-info';
            return (
              <div key={c.id} className="card p-5 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{c.title}</div>
                      <div className="text-xs text-ink-200">{c.clientName} · {c.platform}</div>
                    </div>
                  </div>
                  <span className={`badge ${statusBadge}`}>{c.status}</span>
                </div>
                {c.body && <p className="text-xs text-ink-100 line-clamp-3 mb-2">{c.body}</p>}
                <div className="flex items-center justify-between text-[10px] text-ink-200 mt-3">
                  <span>{timeAgo(c.createdAt)}</span>
                  {c.aiGenerated && <span className="badge badge-gold text-[9px]">✨ AI</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="card p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-ink-200">{t.platform || 'all'} · {t.category}</div>
                </div>
              </div>
              <button className="btn btn-ghost w-full justify-center text-xs">استخدام القالب</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
