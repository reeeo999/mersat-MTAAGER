/**
 * طبقة الذكاء الاصطناعي المجانية
 * تدعم 3 مزودين - بدون أي تكلفة شهرية:
 *  1) Ollama (محلي على جهازك) - الأفضل
 *  2) Hugging Face Inference API (مجاني 30K طلب/شهر)
 *  3) OpenRouter (مجاني لنماذج محددة)
 */

type AIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

async function callOllama(messages: AIMessage[], opts: GenerateOptions = {}): Promise<string | null> {
  const url = process.env.OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: opts.temperature ?? 0.7,
          num_predict: opts.maxTokens ?? 1024,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    return data?.message?.content || null;
  } catch {
    return null;
  }
}

async function callHuggingFace(messages: AIMessage[], opts: GenerateOptions = {}): Promise<string | null> {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) return null;

  const model = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

  try {
    // صيغة prompt لـ Mistral / Llama
    const systemMsg = messages.find(m => m.role === 'system')?.content || '';
    const userMsgs = messages.filter(m => m.role !== 'system');
    const lastUser = userMsgs[userMsgs.length - 1];
    const prompt = `<s>[INST] ${systemMsg ? systemMsg + '\n\n' : ''}${userMsgs.slice(0, -1).map(m => m.content).join('\n')}\n\n${lastUser?.content || ''} [/INST]`;

    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: opts.maxTokens ?? 1024,
          temperature: opts.temperature ?? 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    return null;
  } catch {
    return null;
  }
}

async function callOpenRouter(messages: AIMessage[], opts: GenerateOptions = {}): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages,
        max_tokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

/**
 * الدالة الرئيسية - تجرب المزودين بالترتيب حتى يجيب أحدهم نتيجة
 */
export async function generateAI(
  systemPrompt: string,
  userPrompt: string,
  opts: GenerateOptions = {}
): Promise<string> {
  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // ترتيب الأولوية: Ollama (مجاني تماماً وسريع محلياً) -> OpenRouter -> HuggingFace
  const result =
    (await callOllama(messages, opts)) ||
    (await callOpenRouter(messages, opts)) ||
    (await callHuggingFace(messages, opts));

  if (!result) {
    return getFallbackResponse(systemPrompt, userPrompt);
  }
  return result;
}

function getFallbackResponse(_system: string, user: string): string {
  return `⚠️ تعذّر الوصول لمزود الذكاء الاصطناعي.

الإعدادات المتوقعة في .env:
• OLLAMA_URL=http://localhost:11434 (محلي مجاني)
• أو OPENROUTER_API_KEY=sk-...
• أو HUGGINGFACE_API_KEY=hf_...

اطلبتك: ${user.slice(0, 200)}`;
}

export async function checkAIAvailability(): Promise<{
  ollama: boolean;
  openrouter: boolean;
  huggingface: boolean;
}> {
  const status = { ollama: false, openrouter: false, huggingface: false };

  // Ollama
  try {
    const url = process.env.OLLAMA_URL || 'http://localhost:11434';
    const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(2000) });
    status.ollama = res.ok;
  } catch {}

  status.openrouter = !!process.env.OPENROUTER_API_KEY;
  status.huggingface = !!process.env.HUGGINGFACE_API_KEY;

  return status;
}

// ==================== Prompts متخصصة ====================

export const AI_PROMPTS = {
  adCopy: (product: string, audience: string, platform: string, tone: string) => ({
    system: `أنت كاتب إعلانات محترف بخبرة 30 سنة في وكالات التسويق. تكتب نصوص إعلانات عالية التحويل لـ ${platform}. تجيب بأكثر من نسخة (5+) لاستخدامها في A/B Testing.`,
    user: `المنتج: ${product}
الجمهور المستهدف: ${audience}
اللهجة/الأسلوب: ${tone}

اكتب 5 نسخ إعلانات قصيرة (كل نسخة 3 أسطر كحد أقصى) بـ:
1. عنوان جذاب (Hook)
2. الفائدة الأساسية
3. CTA قوي

أعدها في JSON:
[
  { "headline": "...", "body": "...", "cta": "..." },
  ...
]`,
  }),

  persona: (product: string, niche: string) => ({
    system: `أنت خبير في بناء شخصيات العملاء (Buyer Personas) للسوق العربي. تخرج شخصية مفصّلة يمكن استخدامها في الاستهداف الإعلاني.`,
    user: `المنتج: ${product}
النيتش: ${niche}

ابني شخصية العميل المثالي بـ:
- الاسم والعمر
- الموقع الجغرافي
- الاهتمامات (5+)
- نقاط الألم (5+)
- محفزات الشراء (3+)
- القنوات المفضّلة (3+)

أعدها في JSON.`,
  }),

  competitorAnalysis: (competitor: string, niche: string) => ({
    system: `أنت محلل استراتيجي للسوق. تحلل المنافسين وتستخرج نقاط القوة والضعف والفرص.`,
    user: `المنافس: ${competitor}
النيتش: ${niche}

حلل المنافس واستخرج:
1. نقاط القوة (3+)
2. نقاط الضعف (3+)
3. الفرصة لتمييز عملائنا عنه (3+)
4. نوع الإعلانات الناجحة اللي يستخدمها
5. توصية استراتيجية

أعدها بصيغة منظمة.`,
  }),

  swot: (product: string, market: string) => ({
    system: `أنت خبير استراتيجي تسويقي. تكتب تحليل SWOT احترافي ومباشر.`,
    user: `المنتج: ${product}
السوق المستهدف: ${market}

اكتب تحليل SWOT مختصر (3-4 نقاط في كل قسم):
- Strengths (نقاط القوة)
- Weaknesses (نقاط الضعف)
- Opportunities (الفرص)
- Threats (التهديدات)

ثم 3 توصيات استراتيجية.`,
  }),

  trends: (niche: string, platform: string) => ({
    system: `أنت متخصص في رصد الترندات. تستخرج الترندات الرائجة في النيتش مع تطبيقات عملية.`,
    user: `النيتش: ${niche}
المنصة: ${platform}

استخرج 5 ترندات رائجة الآن مع:
- اسم الترند
- لماذا ينجح
- كيف يطبقه عملاؤنا
- مثال عملي

أعدها في JSON.`,
  }),

  policyCheck: (adCopy: string, platform: string) => ({
    system: `أنت خبير في سياسات الإعلانات لـ ${platform}. تفحص النصوص بدقة وتكشف أي انتهاكات محتملة قبل الرفع.`,
    user: `نص الإعلان:
"${adCopy}"

فحص السياسات:
1. هل فيه كلمات ممنوعة في ${platform}؟
2. هل يوجد ادعاءات صحية/مالية غير مثبتة؟
3. هل يخالف أي سياسة؟

أعد النتيجة:
{
  "approved": true/false,
  "issues": ["..."],
  "suggestions": ["..."]
}`,
  }),

  reportInsight: (data: any) => ({
    system: `أنت محلل بيانات خبير. تستخرج رؤى قابلة للتنفيذ من بيانات التسويق.`,
    user: `بيانات الأسبوع:
${JSON.stringify(data, null, 2)}

استخرج 5 رؤى ذكية:
- إنجازات (2)
- فرص scaling (2)
- تحذيرات (1)
كل insight مع توصية عملية.`,
  }),
};
