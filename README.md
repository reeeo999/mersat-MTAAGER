# ⚓ مِرسَاة (MERSAT) - منصة تشغيل وكالات التسويق

> **منصة موحّدة بالذكاء الاصطناعي** تدير عملاء الوكالة من Onboarding إلى المبيعات الكبيرة. **مجانية 100%** بدون اشتراكات شهرية.

![Status](https://img.shields.io/badge/status-MVP-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Free](https://img.shields.io/badge/cost-0%25-green)

---

## 🎯 المشكلة اللي تحلها المنصة

وكالات التسويق تعاني من:
- ⏱️ **70% من الوقت يضيع في شغل يدوي** (تقارير، نسخ إعلانات، تحليل منافسين)
- 🔥 **Burn budgets** بسبب التأخر في اكتشاف الإعلانات الفاشلة
- 🐌 **تأخير 7-14 يوم** في استلام العميل الجديد
- 📉 **Creative Fatigue** غير مكتشف إلا بعد ما يموت الإعلان
- 🤯 **التقارير تأخذ 4-6 ساعات أسبوعياً** لكل عميل

**مِرسَاة** تحل هذا بـ 7 وحدات متكاملة + AI مجاني.

---

## 🏗️ الوحدات السبع

| # | الوحدة | الوظيفة |
|---|--------|---------|
| 🚪 | **بوابة الانضمام الذكي** | استلام العميل + مؤشر جاهزية تلقائي + مهام افتراضية |
| 🔬 | **مختبر الاستخبارات** | بناء Persona + تحليل منافسين + SWOT + رصد ترندات (كلها بالـ AI) |
| 🎨 | **استوديو الإبداع** | توليد Copy ذكي (5 نسخ بضغطة واحدة) + مكتبة قوالب + إدارة محتوى |
| 🛒 | **معالج المتجر** | إدارة منتجات + فاحص بيكسل (Meta/TikTok/Google/GA4) + فحص سرعة |
| 📢 | **غرفة الإعلانات** | إدارة Meta + TikTok + Google + توصيات AI |
| 📊 | **مركز التحليلات** | Dashboard موحد لكل المنصات + أفضل/أضعف الأيام + تقارير |
| 🤖 | **محرك الأتمتة** | Workflows تلقائية + مهام + رؤى ذكية + تنبيهات |

---

## 💰 التكلفة الفعلية: 0$ شهرياً

| المكوّن | التكلفة | البديل المدفوع |
|---------|---------|----------------|
| Frontend (Next.js) | **مجاني** (Vercel Hobby) | - |
| قاعدة البيانات (SQLite) | **مجاني** (ملف محلي) | - |
| استضافة Backend | **مجاني** (Railway $5 credit شهرياً أو Oracle Cloud Free Tier) | - |
| AI - Ollama محلي | **مجاني تماماً** | GPT-4 ($20/شهر) |
| AI - Hugging Face API | **مجاني 30K طلب/شهر** | - |
| AI - OpenRouter free | **مجاني لنماذج محددة** | - |

**الخلاصة: المنصة شغّالة بدون أي اشتراك شهري.** 🎉

---

## 🚀 التثبيت السريع (5 دقائق)

### المتطلبات الأساسية
- **Node.js 18+** ([تحميل](https://nodejs.org))
- **Git** (اختياري)

### الخطوات

```bash
# 1) استنساخ المشروع
git clone <your-repo> mersat
cd mersat

# 2) تثبيت المكتبات
npm install

# 3) إعداد قاعدة البيانات
cp .env.example .env
npx prisma db push
npm run db:seed    # يضيف بيانات تجريبية

# 4) تشغيل
npm run dev
```

ثم افتح **http://localhost:3000** ✅

---

## 🤖 إعداد الذكاء الاصطناعي المجاني

### الخيار 1: Ollama (الأفضل - مجاني 100%)

```bash
# على Mac
brew install ollama
ollama serve

# في terminal آخر، حمّل موديل
ollama pull llama3.1:8b

# ثم ضع في .env:
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

**متطلبات Ollama:** 8GB RAM على الأقل (16GB أفضل).

### الخيار 2: Hugging Face API (مجاني، سحابي)

1. سجّل حساب مجاني في [huggingface.co](https://huggingface.co)
2. أنشئ API token من [هنا](https://huggingface.co/settings/tokens)
3. ضع في `.env`:
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

**الحد المجاني:** ~30,000 طلب/شهر (يكفي لـ 100+ عميل).

### الخيار 3: OpenRouter (مجاني لنماذج محددة)

1. سجّل في [openrouter.ai](https://openrouter.ai)
2. أنشئ API key
3. ضع في `.env`:
```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
```

---

## 📦 النشر المجاني على الإنترنت

### الخيار A: Vercel + Railway (أسهل)

```bash
# Frontend على Vercel (مجاني)
npm i -g vercel
vercel

# Backend + Database على Railway (مجاني $5 credit شهرياً)
# اربط الـ GitHub repo في railway.app
```

### الخيار B: VPS مجاني (تحكم كامل)

- **Oracle Cloud Free Tier** - VPS مجاني للأبد
- **Google Cloud Free Tier** - $300 credit لـ 90 يوم
- **AWS Free Tier** - 12 شهر مجاناً

### الخيار C: Self-hosted (في جهازك أو سيرفر الشركة)

```bash
# بناء للـ production
npm run build
npm start
```

---

## 🛠️ التقنيات المستخدمة

| الطبقة | التقنية | السبب |
|--------|---------|-------|
| Frontend | Next.js 14 + React 18 + TypeScript | أداء عالي + SEO |
| Styling | Tailwind CSS | سرعة التطوير |
| Database | SQLite (Prisma ORM) | مجاني + بدون إعدادات |
| Charts | Recharts | مفتوح المصدر |
| Icons | Lucide React | خفيف وجميل |
| AI Layer | Ollama / HF / OpenRouter | كلهم مجانيين |
| Forms | React Hook Form + Zod | أقوى combo |

---

## 📁 بنية المشروع

```
mersat/
├── prisma/
│   ├── schema.prisma       # مخطط قاعدة البيانات (20+ جدول)
│   └── seed.ts             # بيانات تجريبية
├── src/
│   ├── app/
│   │   ├── (app)/          # صفحات الـ Dashboard
│   │   │   ├── page.tsx              # الرئيسية
│   │   │   ├── onboarding/           # وحدة 1
│   │   │   ├── intelligence/         # وحدة 2
│   │   │   ├── creative/             # وحدة 3
│   │   │   ├── store/                # وحدة 4
│   │   │   ├── ads/                  # وحدة 5
│   │   │   ├── analytics/            # وحدة 6
│   │   │   └── automation/           # وحدة 7
│   │   ├── api/                      # API endpoints
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/         # مكونات مشتركة
│   └── lib/
│       ├── db.ts           # Prisma client
│       ├── ai.ts           # طبقة AI موحدة
│       └── utils.ts
├── .env.example
├── package.json
└── README.md (هذا الملف)
```

---

## 🎬 سيناريوهات الاستخدام

### 1) استلام عميل جديد
- اذهب لـ **استلام العميل** → **+ استلام عميل جديد**
- املأ البيانات → المنصة تحسب الجاهزية تلقائياً
- تُنشأ 7 مهام افتراضية + تنبيه لكل عضو فريق

### 2) بناء Persona بالـ AI
- اذهب لـ **مختبر الاستخبارات** → تبويب **Persona**
- اكتب المنتج → اضغط "توليد"
- النتيجة: شخصية كاملة (عمر، اهتمامات، نقاط ألم، قنوات)

### 3) توليد 5 نسخ إعلانات
- اذهب لـ **استوديو الإبداع** → تبويب **توليد Copy**
- اكتب المنتج + اختر المنصة + اللهجة
- النتيجة: 5 نسخ جاهزة للـ A/B Testing

### 4) تحليل ROAS
- اذهب لـ **مركز التحليلات**
- تشاهد: مبيعات، إنفاق، ROAS، أفضل/أضعف الأيام
- النتيجة: قرارات scaling مبنية على بيانات

---

## 🗺️ خارطة الطريق

### ✅ المرحلة 1 (الحالية - MVP)
- [x] جميع الوحدات الـ 7
- [x] AI مجاني (3 مزودين)
- [x] بيانات تجريبية
- [x] Dashboard كامل

### 🚧 المرحلة 2 (قريباً)
- [ ] تكامل Meta Marketing API (رفع إعلانات حقيقي)
- [ ] تكامل TikTok Business API
- [ ] تكامل Shopify / Salla / Zid
- [ ] نظام Multi-user (فريق)
- [ ] تصدير PDF للتقارير

### 🌟 المرحلة 3 (المستقبل)
- [ ] Mobile app (React Native)
- [ ] Voice transcription (Whisper محلي)
- [ ] Auto image generation (Stable Diffusion محلي)
- [ ] WhatsApp bot integration
- [ ] Slack/Discord notifications

---

## 🤝 المساهمة

المشروع مفتوح المصدر (MIT License). نشجعك على:
- 🐛 الإبلاغ عن bugs
- 💡 اقتراح features
- 🔧 إرسال Pull Requests
- ⭐ إعطاء star على GitHub

---

## 📜 الترخيص

MIT License - استخدمه تجارياً، عدّل، وزّع بحرية.

---

## 💬 الدعم

- **GitHub Issues** - للأخطاء التقنية
- **Discord Community** - للنقاشات (قريباً)
- **Documentation** - في مجلد `/docs`

---

## ⚓ رسالة من المطور

> "بعد 30 سنة في وكالات التسويق، الأهم من الإبداع هو **النظام**. مِرسَاة هو النظام اللي كنت أتمنى لو موجود لما بدأت."
>
> — مبني بحب للمجتمع العربي 💚

**الوكالات الصغيرة والمتوسطة تستاهل أدوات بقدرات الكبيرة، بدون ما تدفع فاتورة الكبيرة.**

---

<div align="center">

**⚓ مِرسَاة - ثبّت وكالتك في 7 أيام**

</div>
