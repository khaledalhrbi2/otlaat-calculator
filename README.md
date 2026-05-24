# 🧳 حاسبة السفر | Otlaat Travel Calculator v2.0

موقع عربي مبني بـ Next.js 16 و TypeScript لحساب تكلفة السفر التقديرية، عرض باقات عطلات، وحفظ طلبات العملاء قبل تحويلهم إلى واتساب.

## ✨ المميزات الجديدة في v2.0

- 🔐 **حماية أمنية شاملة**: middleware للأدمن + Basic Auth + rate limiting
- 🎨 **هوية بصرية جديدة**: ثيم عطلات الرسمي (برتقالي + أسود حبر)
- 📱 **استجابة كاملة**: قائمة موبايل، تصميم متجاوب
- ⚡ **أداء محسّن**: خطوط Google محلية، animations ناعمة
- 🛡️ **حماية ضد الـ spam**: rate limit على API leads (5 طلبات/دقيقة)
- ✅ **TypeScript صارم**: صفر أخطاء بدون `ignoreBuildErrors`

## 🚀 التشغيل المحلي

```bash
npm install
cp .env.example .env.local
# عدّل ADMIN_USER و ADMIN_PASS في .env.local
npm run dev
```

ثم افتح `http://localhost:3000`.

## 🔐 الإعدادات الأمنية المطلوبة

في `.env.local` (إلزامي):

```bash
# مصادقة الأدمن - استخدم كلمة مرور قوية!
ADMIN_USER=your_username
ADMIN_PASS=your_strong_password_min_16_chars

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=9665XXXXXXXX

# Google Sheets (اختياري)
GOOGLE_SHEETS_DATA_ENDPOINT=
GOOGLE_SHEETS_LEADS_WEBHOOK_URL=
```

> ⚠️ **مهم**: لو تركت `ADMIN_USER` و `ADMIN_PASS` فاضيين، لوحة الأدمن راح ترجع 503 لجميع الزوار (آمن افتراضياً).

## 📂 هيكل المشروع

```
otlaat-calclauter/
├── middleware.ts          # 🆕 حماية الأدمن
├── app/
│   ├── globals.css        # 🎨 ثيم عطلات الجديد
│   ├── layout.tsx         # SEO metadata محسّن
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── admin/             # لوحة التحكم (محمية)
│   └── api/
│       ├── admin/         # 🔐 API محمي بـ Basic Auth
│       └── leads/         # 🆕 Rate limiting
├── components/
│   ├── Header.tsx         # 🎨 محدّث بهوية عطلات
│   ├── Footer.tsx         # 🆕 4 أعمدة + شارات ثقة
│   ├── TravelCalculator.tsx
│   └── AdminDashboard.tsx
├── lib/
│   ├── types.ts
│   ├── calculator.ts
│   └── data.ts
└── data/
    └── travel-data.json
```

## 🎨 هوية عطلات البصرية

- **برتقالي أساسي**: `#FF6B1A`
- **أسود حبر**: `#0F1426`
- **خط العناوين**: Cairo (900)
- **خط النصوص**: Tajawal (400-700)
- **Radius**: 8-28px (تدرج)

## 🔒 طبقات الحماية الأمنية

1. **Middleware**: يحمي `/admin` و `/api/admin/*` بـ Basic HTTP Auth
2. **API Layer**: حماية إضافية داخل الـ route handlers (Defense in Depth)
3. **Validation**: التحقق من بنية البيانات قبل الحفظ
4. **Rate Limiting**: 5 طلبات/دقيقة لكل IP على `/api/leads`
5. **Fail-Safe Default**: لو المتغيرات البيئية ناقصة → الأدمن مغلق

## 🚀 للنشر على Vercel

```bash
# 1. ادفع المشروع لـ GitHub
git init
git add .
git commit -m "v2.0 with security + new theme"
git remote add origin https://github.com/yourrepo/otlaat-calc.git
git push -u origin main

# 2. في Vercel:
# - استورد المشروع
# - أضف Environment Variables (ADMIN_USER, ADMIN_PASS, etc.)
# - انشر
```

## 📝 الخطوات التالية الموصى بها

- [ ] إضافة بيانات الطيران للحاسبة
- [ ] تطبيق منطق "وفّر مع عطلات" (مستقل vs عطلات)
- [ ] استبدال filesystem storage بـ Supabase
- [ ] إضافة Google Analytics + Meta Pixel + TikTok Pixel
- [ ] ترقية الحماية لـ NextAuth.js مع Google OAuth
- [ ] تطبيق Season filtering الفعلي
- [ ] إضافة 17+ وجهة إضافية

---

**Built with ❤️ by Otlaat Team**
