# 🌉 GyanSetu — ज्ञान सेतु
## Free UPSC & NEET Preparation Platform | Hindi & English

---

## 🚀 Run Locally in 5 Minutes

### Step 1 — Install Node.js
Download from https://nodejs.org (version 18 or higher)

### Step 2 — Extract & Open Project
```bash
cd gyansetu
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Set up environment variables
```bash
cp .env.local.example .env.local
```
Open `.env.local` and fill in your free API keys (see below).

### Step 5 — Run the development server
```bash
npm run dev
```

Open http://localhost:3000 — your website is running! 🎉

---

## 🔑 Free API Keys Setup

### 1. Supabase (Database + Auth) — FREE
1. Go to https://supabase.com
2. Create a free account → New Project
3. Go to Settings → API
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Google Gemini AI — FREE
1. Go to https://aistudio.google.com
2. Sign in with Google account
3. Click "Get API Key" → Create API Key
4. Copy the key → `GEMINI_API_KEY`
5. Free limit: 1 million tokens/day (enough for 5000+ student questions)

### 3. YouTube Data API — FREE
1. Go to https://console.cloud.google.com
2. Create a project → Enable "YouTube Data API v3"
3. Create credentials → API Key
4. Copy → `NEXT_PUBLIC_YOUTUBE_API_KEY`
5. Free limit: 10,000 units/day

---

## 📁 Project Structure

```
gyansetu/
├── src/
│   ├── app/                    # All pages
│   │   ├── page.tsx            # Homepage
│   │   ├── lectures/page.tsx   # Video lectures
│   │   ├── pyq/page.tsx        # Previous year questions
│   │   ├── mock-test/page.tsx  # Mock tests
│   │   ├── ai-tutor/page.tsx   # AI doubt solver
│   │   ├── current-affairs/    # Daily current affairs
│   │   └── api/ai/doubt/       # Gemini AI API route
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx      # Top navigation with language toggle
│   │       └── Footer.tsx      # Footer
│   ├── lib/
│   │   ├── lang-context.tsx    # Hindi/English language switcher
│   │   ├── supabase.ts         # Database connection
│   │   └── gemini.ts           # AI helper functions
│   └── styles/
│       └── globals.css         # Global styles + fonts
├── .env.local.example          # Environment variables template
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🌐 Deploy to Internet (Free)

### Deploy on Vercel (Recommended — Free)
1. Push code to GitHub (free)
2. Go to https://vercel.com → Import your GitHub repo
3. Add environment variables in Vercel dashboard
4. Click Deploy → Your site is live at `gyansetu.vercel.app`
5. Add custom domain `gyansetu.in` (buy from GoDaddy ~₹800/year)

---

## ✅ Features Built

| Feature | Status | Language |
|---------|--------|----------|
| Homepage with dashboard preview | ✅ | Hindi + English |
| Language toggle (Hindi/English) | ✅ | Full site |
| Video lectures with playlist | ✅ | Hindi/English/Bilingual filter |
| PYQ bank with interactive MCQs | ✅ | Hindi + English papers |
| AI doubt solver (Gemini API) | ✅ | Auto-detects Hindi/English |
| Mock test with timer | ✅ | Hindi + English |
| Daily current affairs | ✅ | Hindi + English |
| Responsive mobile design | ✅ | All pages |
| Navbar with language switch | ✅ | Full site |
| Footer with all links | ✅ | Hindi + English |

---

## 🛠️ Add Real Content (Admin)

To add real videos, PYQs and current affairs:
1. Set up Supabase (step above)
2. Create tables using the types in `src/lib/supabase.ts`
3. Use Supabase dashboard to insert content
4. Update page components to fetch from Supabase instead of static data

---

## 📞 Tech Stack (All Free)

- **Next.js 14** — Framework
- **Tailwind CSS** — Styling
- **Supabase** — Database + Auth (free tier)
- **Google Gemini API** — AI features (free tier)
- **YouTube iFrame API** — Video lectures (free)
- **Vercel** — Hosting (free tier)

---

Made with ❤️ for India's UPSC & NEET aspirants | gyansetu.in
