'use client';

import { useState } from 'react';
import { Search, Users, TrendingUp, Sparkles, Loader2, Target, Hash, Music } from 'lucide-react';
import { generateAI, AI_PROMPTS } from '@/lib/ai';
import { formatNumber } from '@/lib/utils';

interface ClientOpt { id: string; name: string; niche: string | null; }
interface Trend {
  id: string; niche: string; platform: string;
  hashtag: string | null; sound: string | null; format: string | null;
  reach: number | null; velocity: number | null;
}
interface Persona { id: string; clientName: string; name: string; ageRange: string | null; location: string | null; }

interface Props {
  clients: ClientOpt[];
  trends: Trend[];
  personas: Persona[];
  aiStatus: { ollama: boolean; openrouter: boolean; huggingface: boolean };
}

export default function IntelligenceClient({ clients, trends, personas, aiStatus }: Props) {
  const [tab, setTab] = useState<'persona' | 'competitor' | 'swot' | 'trends'>('persona');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // Form state
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [product, setProduct] = useState('');
  const [niche, setNiche] = useState(clients[0]?.niche || '');
  const [audience, setAudience] = useState('');
  const [competitor, setCompetitor] = useState('');

  const aiAvailable = aiStatus.ollama || aiStatus.openrouter || aiStatus.huggingface;

  const runPersona = async () => {
    if (!product) return alert('أدخل اسم المنتج');
    setLoading(true);
    setResult('');
    const p = AI_PROMPTS.persona(product, niche || 'عام');
    const out = await generateAI(p.system, p.user);
    setResult(out);
    setLoading(false);
  };

  const runCompetitor = async () => {
    if (!competitor) return alert('أدخل اسم المنافس');
    setLoading(true);
    setResult('');
    const p = AI_PROMPTS.competitorAnalysis(competitor, niche || 'عام');
    const out = await generateAI(p.system, p.user);
    setResult(out);
    setLoading(false);
  };

  const runSWOT = async () => {
    if (!product) return alert('أدخل اسم المنتج');
    setLoading(true);
    setResult('');
    const p = AI_PROMPTS.swot(product, niche || 'السوق العربي');
    const out = await generateAI(p.system, p.user);
    setResult(out);
    setLoading(false);
  };

  const runTrends = async () => {
    if (!niche) return alert('أدخل النيتش');
    setLoading(true);
    setResult('');
    const p = AI_PROMPTS.trends(niche, 'meta + tiktok');
    const out = await generateAI(p.system, p.user);
    setResult(out);
    setLoading(false);
  };

  const tabs = [
    { id: 'persona', label: 'بناء Persona', icon: Users, color: 'text-sky-400' },
    { id: 'competitor', label: 'تحليل المنافس', icon: Target, color: 'text-rose-400' },
    { id: 'swot', label: 'تحليل SWOT', icon: Search, color: 'text-amber-400' },
    { id: 'trends', label: 'الترندات', icon: TrendingUp, color: 'text-emerald-400' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      <div className={`card p-4 flex items-center gap-3 ${aiAvailable ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
        <Sparkles className={`w-5 h-5 ${aiAvailable ? 'text-emerald-400' : 'text-amber-400'}`} />
        <div className="flex-1 text-sm">
          {aiAvailable ? (
            <span className="text-emerald-400">
              ✅ الذكاء الاصطناعي متاح - المزودات النشطة:{' '}
              {aiStatus.ollama && 'Ollama (محلي) '}
              {aiStatus.openrouter && 'OpenRouter '}
              {aiStatus.huggingface && 'HuggingFace'}
            </span>
          ) : (
            <span className="text-amber-400">
              ⚠️ لا يوجد مزود AI مفعّل. أضف OLLAMA_URL أو OPENROUTER_API_KEY في ملف .env
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setResult(''); }}
              className={`btn ${tab === t.id ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30' : 'btn-ghost'}`}
            >
              <Icon className={`w-4 h-4 ${t.color}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">
            {tab === 'persona' && '👤 بناء شخصية العميل'}
            {tab === 'competitor' && '🎯 تحليل منافس'}
            {tab === 'swot' && '📊 تحليل SWOT'}
            {tab === 'trends' && '🔥 رصد الترندات'}
          </h3>

          {tab === 'persona' && (
            <>
              <div>
                <label className="label">العميل (اختياري)</label>
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="input">
                  <option value="">بدون ربط</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">المنتج *</label>
                <input value={product} onChange={(e) => setProduct(e.target.value)} className="input" placeholder="مثال: فستان سهرة فاخر" />
              </div>
              <div>
                <label className="label">النيتش</label>
                <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" placeholder="أزياء نسائية" />
              </div>
              <button onClick={runPersona} disabled={loading || !aiAvailable} className="btn btn-primary w-full justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                توليد الشخصية
              </button>
            </>
          )}

          {tab === 'competitor' && (
            <>
              <div>
                <label className="label">اسم المنافس *</label>
                <input value={competitor} onChange={(e) => setCompetitor(e.target.value)} className="input" placeholder="مثال: نسناس" />
              </div>
              <div>
                <label className="label">النيتش</label>
                <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" placeholder="أزياء نسائية" />
              </div>
              <button onClick={runCompetitor} disabled={loading || !aiAvailable} className="btn btn-primary w-full justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                تحليل المنافس
              </button>
            </>
          )}

          {tab === 'swot' && (
            <>
              <div>
                <label className="label">المنتج *</label>
                <input value={product} onChange={(e) => setProduct(e.target.value)} className="input" placeholder="اسم المنتج" />
              </div>
              <div>
                <label className="label">السوق المستهدف</label>
                <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" placeholder="السعودية، الإمارات..." />
              </div>
              <button onClick={runSWOT} disabled={loading || !aiAvailable} className="btn btn-primary w-full justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                تحليل SWOT
              </button>
            </>
          )}

          {tab === 'trends' && (
            <>
              <div>
                <label className="label">النيتش *</label>
                <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" placeholder="أزياء، عطور، تقنية..." />
              </div>
              <button onClick={runTrends} disabled={loading || !aiAvailable} className="btn btn-primary w-full justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                رصد الترندات
              </button>
            </>
          )}
        </div>

        {/* Result */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold text-white">النتيجة</h3>
          </div>

          {result ? (
            <div className="prose prose-invert max-w-none text-sm text-ink-100 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          ) : (
            <div className="text-center py-12 text-ink-200 text-sm">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              {loading ? 'جاري التحليل...' : 'املأ النموذج واحصل على تحليل ذكي'}
            </div>
          )}
        </div>
      </div>

      {/* Live Trends + Personas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">ترندات رائجة الآن</h3>
          </div>
          <div className="space-y-2">
            {trends.slice(0, 8).map((t) => (
              <div key={t.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  {t.hashtag ? <Hash className="w-4 h-4 text-emerald-400" /> : <Music className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {t.hashtag || t.sound || t.format}
                  </div>
                  <div className="text-xs text-ink-200">
                    {t.niche} · {t.platform}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">{formatNumber(t.reach || 0)}</div>
                  <div className="text-[10px] text-ink-200">وصول</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Personas محفوظة</h3>
          </div>
          <div className="space-y-2">
            {personas.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-ink-900/50 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs text-ink-200">
                    {p.clientName} · {p.ageRange} · {p.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
