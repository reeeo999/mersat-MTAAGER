# 🚀 دليل التثبيت خطوة بخطوة

دليل مفصّل لتثبيت وتشغيل مِرسَاة على جهازك أو سيرفر مجاني.

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

### Node.js 18+
```bash
# تحقق من الإصدار
node --version   # يجب أن يكون v18 أو أعلى

# إذا غير مثبت، حمّل من:
# https://nodejs.org
```

### Git (اختياري)
```bash
git --version
```

---

## ⚡ التثبيت السريع (5 دقائق)

### 1) نسخ المشروع
```bash
# إذا عندك Git
git clone <repository-url> mersat
cd mersat

# أو فك الضغط عن ملف ZIP وانتقل للمجلد
cd mersat
```

### 2) تثبيت المكتبات
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

> ⏱️ أول مرة تأخذ 2-3 دقائق.

### 3) إعداد البيئة
```bash
cp .env.example .env
```

افتح `.env` بأي محرر:
- إذا تستخدم **Ollama محلي** (الأفضل): اترك الإعدادات كما هي
- إذا تستخدم **Hugging Face**: أضف `HUGGINGFACE_API_KEY=hf_xxx`
- إذا تستخدم **OpenRouter**: أضف `OPENROUTER_API_KEY=sk-or-xxx`

### 4) قاعدة البيانات
```bash
npx prisma db push       # ينشئ الجداول
npm run db:seed          # يضيف بيانات تجريبية
```

### 5) تشغيل
```bash
npm run dev
```

ثم افتح: **http://localhost:3000** 🎉

---

## 🤖 إعداد الذكاء الاصطناعي (اختياري لكن موصى به)

### الخيار 1: Ollama محلي (الأفضل والأرخص)

#### على Mac
```bash
brew install ollama
brew services start ollama

# في terminal آخر
ollama pull llama3.1:8b
```

#### على Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
```

#### على Windows
1. حمّل من [ollama.com/download](https://ollama.com/download)
2. ثبّت + شغّل
3. افتح PowerShell:
```powershell
ollama pull llama3.1:8b
```

#### متطلبات Hardware
- **8GB RAM** كحد أدنى
- **16GB RAM** أفضل
- **مساحة 5GB** للموديل

#### الموديلات الموصى بها

| الموديل | الحجم | الجودة | يحتاج RAM |
|---------|-------|--------|-----------|
| `llama3.1:8b` | 4.7GB | ⭐⭐⭐⭐ | 8GB |
| `mistral:7b` | 4.1GB | ⭐⭐⭐⭐ | 8GB |
| `qwen2.5:7b` | 4.7GB | ⭐⭐⭐⭐⭐ | 8GB |
| `llama3.1:70b` | 40GB | ⭐⭐⭐⭐⭐ | 64GB |

#### ضع في `.env`:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

---

### الخيار 2: Hugging Face API (سحابي مجاني)

1. سجّل في [huggingface.co](https://huggingface.co/join) (مجاني)
2. اذهب لـ [Settings → Tokens](https://huggingface.co/settings/tokens)
3. اضغط **New token** → اختر **Read**
4. انسخ الـ Token

#### ضع في `.env`:
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

#### موديلات أخرى مقترحة:
- `mistralai/Mistral-7B-Instruct-v0.3` (الأفضل)
- `meta-llama/Meta-Llama-3-8B-Instruct`
- `google/gemma-7b-it`
- `microsoft/Phi-3-mini-4k-instruct` (أسرع)

**الحد المجاني:** ~30,000 طلب/شهر (يكفي لـ 100+ عميل).

---

### الخيار 3: OpenRouter (مجاني + نماذج كثيرة)

1. سجّل في [openrouter.ai](https://openrouter.ai)
2. أنشئ API Key من [Keys](https://openrouter.ai/keys)
3. ضع في `.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
```

---

## 🌐 النشر المجاني على الإنترنت

### الخيار A: Vercel (الأسهل - 5 دقائق)

```bash
# ثبّت Vercel CLI
npm i -g vercel

# من مجلد المشروع
vercel
```

اتبع التعليمات:
1. Login
2. اختر "Set up and deploy"
3. اضغط Enter لكل الأسئلة الافتراضية

#### ملاحظة: قاعدة البيانات
Vercel لا يدعم SQLite بشكل دائم. للـ production استخدم:
- **Vercel Postgres** (مجاني 256MB)
- **Supabase** (مجاني 500MB)
- **Neon** (مجاني 512MB)

غيّر `provider` في `prisma/schema.prisma` من `sqlite` إلى `postgresql` وعدّل `DATABASE_URL`.

---

### الخيار B: Railway.app (مجاني $5 شهرياً)

1. ارفع المشروع على GitHub
2. اذهب لـ [railway.app](https://railway.app)
3. **New Project** → **Deploy from GitHub**
4. اختر الـ Repo
5. أضف متغيرات البيئة (من `.env`)
6. Railway يضيف **PostgreSQL** تلقائياً (مجاني ضمن الـ $5)

---

### الخيار C: VPS مجاني (تحكم كامل)

#### Oracle Cloud Free Tier (الأفضل)

1. سجّل في [cloud.oracle.com](https://cloud.oracle.com) (مجاني للأبد)
2. أنشئ VM:
   - Shape: `VM.Standard.E2.1.Micro` (مجاني)
   - OS: Ubuntu 22.04
   - 1 CPU + 1GB RAM (يكفي لـ 50+ مستخدم)
3. SSH للسيرفر:
```bash
ssh ubuntu@your-server-ip
```

4. ثبّت Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

5. انسخ المشروع:
```bash
git clone <your-repo> mersat
cd mersat
npm install
npx prisma db push
npm run db:seed
```

6. ثبّت PM2 (process manager):
```bash
sudo npm i -g pm2
pm2 start npm --name mersat -- start
pm2 startup
pm2 save
```

7. (اختياري) Nginx reverse proxy + SSL:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
# عدّل /etc/nginx/sites-available/default
# شغّل: sudo certbot --nginx -d yourdomain.com
```

---

## 🧪 اختبار التشغيل

بعد التشغيل، تأكد من:

1. ✅ الصفحة الرئيسية تعمل: http://localhost:3000
2. ✅ Dashboard يعرض: http://localhost:3000
3. ✅ قائمة العملاء: http://localhost:3000/onboarding
4. ✅ مختبر الاستخبارات: http://localhost:3000/intelligence
5. ✅ استوديو الإبداع: http://localhost:3000/creative

---

## 🔧 حل المشاكل الشائعة

### مشكلة: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
npm install
```

### مشكلة: "Port 3000 is already in use"
```bash
# شغّل على port آخر
npm run dev -- -p 3001
```

### مشكلة: Ollama لا يستجيب
```bash
# تحقق أنه شغّال
curl http://localhost:11434/api/tags

# أعد تشغيله
ollama serve
```

### مشكلة: HuggingFace "Model is loading"
أول طلب يأخذ 20-30 ثانية (الموديل يصحو). الطلبات التالية سريعة.

### مشكلة: قاعدة البيانات فارغة
```bash
npm run db:seed
```

---

## 📊 مراقبة الأداء

### عرض logs PM2
```bash
pm2 logs mersat
pm2 monit
```

### عرض Prisma Studio (DB GUI)
```bash
npm run db:studio
```
ثم افتح: http://localhost:5555

---

## 🔄 التحديثات

```bash
git pull
npm install
npx prisma db push
npm run build
pm2 restart mersat
```

---

## 💬 الدعم

- **GitHub Issues** - للأخطاء
- **Discord** - للأسئلة العامة (قريباً)

---

**جاهز؟** شغّل `npm run dev` وابدأ! 🚀
