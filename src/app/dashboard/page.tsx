'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Brain, FileText, Tv2, Newspaper, PenLine, Flame, Target, TrendingUp, Clock, ChevronRight, Star } from 'lucide-react'
import { useLang } from '@/lib/lang-context'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false

function getSupabaseClient() {
  if (!supabaseReady) return null
  try {
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
    return createClientComponentClient()
  } catch { return null }
}

const quickActions = [
  { icon: Tv2,       href: '/lectures',        en: 'Video Lectures',    hi: 'वीडियो व्याख्यान', color: 'bg-blue-50 text-blue-600',   badge: '' },
  { icon: FileText,  href: '/pyq',             en: 'PYQ Bank',          hi: 'प्रश्न बैंक',       color: 'bg-purple-50 text-purple-600', badge: '' },
  { icon: Brain,     href: '/ai-tutor',        en: 'AI Tutor',          hi: 'AI शिक्षक',          color: 'bg-[#fff5ef] text-[#E8630A]',  badge: 'AI' },
  { icon: PenLine,   href: '/mock-test',       en: 'Mock Test',         hi: 'मॉक टेस्ट',         color: 'bg-green-50 text-green-600',   badge: '' },
  { icon: Newspaper, href: '/current-affairs', en: 'Current Affairs',   hi: 'समसामयिकी',         color: 'bg-yellow-50 text-yellow-600', badge: 'New' },
  { icon: BookOpen,  href: '#',               en: 'NCERT Library',     hi: 'NCERT लाइब्रेरी',  color: 'bg-pink-50 text-pink-600',     badge: 'Soon' },
]

const subjects = [
  { en: 'Polity & Governance', hi: 'राजव्यवस्था', pct: 62, color: 'bg-blue-500' },
  { en: 'History',             hi: 'इतिहास',       pct: 45, color: 'bg-purple-500' },
  { en: 'Geography',           hi: 'भूगोल',        pct: 38, color: 'bg-green-500' },
  { en: 'Economy',             hi: 'अर्थव्यवस्था', pct: 28, color: 'bg-yellow-500' },
  { en: 'Environment',         hi: 'पर्यावरण',     pct: 20, color: 'bg-[#E8630A]' },
]

const recentActivity = [
  { icon: '📺', en: 'Watched: Indian Constitution — Fundamental Rights', hi: 'देखा: भारतीय संविधान — मूल अधिकार', time: '2h ago' },
  { icon: '✅', en: 'Attempted: UPSC Prelims 2023 GS1 — 40/100 correct', hi: 'प्रयास: UPSC प्रीलिम्स 2023 GS1 — 40/100 सही', time: '1d ago' },
  { icon: '🤖', en: 'Asked AI: Difference between FIR and Chargesheet', hi: 'AI से पूछा: FIR और Chargesheet में अंतर', time: '2d ago' },
]

export default function DashboardPage() {
  const { t } = useLang()
  const router = useRouter()
  const [supabase] = useState(() => getSupabaseClient())
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }: any) => {
      if (!data.session) {
        router.replace('/login')
      } else {
        setUser(data.session.user)
        setLoading(false)
      }
    })
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-62px)] flex items-center justify-center bg-[#f7f8fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#E8630A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#64748b]">{t('Loading your dashboard…', 'डैशबोर्ड लोड हो रहा है…')}</p>
        </div>
      </div>
    )
  }

  const meta = user?.user_metadata || {}
  const name = meta.name || user?.email?.split('@')[0] || 'Student'
  const firstName = name.split(' ')[0]
  const examGoal = meta.exam_goal || 'UPSC'
  const examYear = meta.exam_year || new Date().getFullYear() + 1
  const daysLeft = Math.ceil((new Date(`${examYear}-06-01`).getTime() - Date.now()) / 86400000)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('Good morning', 'सुप्रभात') : hour < 17 ? t('Good afternoon', 'नमस्कार') : t('Good evening', 'शुभ संध्या')

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#f7f8fa]">
      <div className="max-w-[1140px] mx-auto px-[5%] py-8">

        {/* ── Welcome Banner ── */}
        <div className="bg-gradient-to-br from-[#E8630A] to-[#c4520a] rounded-2xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
          <div className="absolute right-12 bottom-0 w-24 h-24 rounded-full bg-white/5 translate-y-8" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-1">{greeting},</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{firstName} 👋</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                🎯 {examGoal} {examYear}
              </span>
              {daysLeft > 0 && (
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ⏳ {daysLeft} {t('days left', 'दिन बाकी')}
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm max-w-md">
              {t(
                'Keep going! Consistency is the key to cracking UPSC.',
                'जारी रखें! निरंतरता ही UPSC की सफलता की कुंजी है।'
              )}
            </p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Flame,      val: '3',    label: t('Day Streak', 'दिन की streak'),       color: 'text-[#E8630A]', bg: 'bg-[#fff5ef]' },
            { icon: Tv2,        val: '12',   label: t('Videos Watched', 'वीडियो देखे'),      color: 'text-blue-600',   bg: 'bg-blue-50' },
            { icon: Target,     val: '140',  label: t('Questions Done', 'प्रश्न हल किए'),    color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: TrendingUp, val: '68%',  label: t('Avg. Score', 'औसत स्कोर'),            color: 'text-green-600',  bg: 'bg-green-50' },
          ].map(({ icon: Icon, val, label, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e8eaed] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <div className="text-xl font-bold text-[#0f172a]">{val}</div>
                <div className="text-xs text-[#64748b]">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
              <h2 className="text-base font-bold text-[#0f172a] mb-4">{t('Quick Actions', 'त्वरित लिंक')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map(({ icon: Icon, href, en, hi, color, badge }) => (
                  <Link
                    key={en}
                    href={href}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border border-[#e8eaed] hover:border-[#E8630A]/40 hover:shadow-sm transition-all no-underline group ${href === '#' ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    {badge && (
                      <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge === 'Soon' ? 'bg-[#f1f5f9] text-[#64748b]' : badge === 'New' ? 'bg-green-100 text-green-700' : 'bg-[#fff5ef] text-[#E8630A]'}`}>
                        {badge}
                      </span>
                    )}
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-[#0f172a] text-center leading-tight">{t(en, hi)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#0f172a]">{t('Recent Activity', 'हाल की गतिविधि')}</h2>
                <span className="text-xs text-[#94a3b8]">{t('Last 7 days', 'पिछले 7 दिन')}</span>
              </div>
              <div className="flex flex-col gap-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#f7f8fa]">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0f172a] font-medium leading-tight">{t(item.en, item.hi)}</p>
                      <p className="text-xs text-[#94a3b8] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#94a3b8] text-center mt-4">
                {t('Activity tracking connects to Supabase — coming soon', 'गतिविधि ट्रैकिंग जल्द आएगी')}
              </p>
            </div>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="flex flex-col gap-6">

            {/* Streak card */}
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-black text-[#E8630A] mb-1">3</div>
              <div className="text-sm font-semibold text-[#0f172a] mb-1">{t('Day Streak', 'दिन की streak')}</div>
              <p className="text-xs text-[#64748b] mb-4">{t('Study daily to keep your streak alive!', 'streak बनाए रखने के लिए रोज़ पढ़ें!')}</p>
              <div className="flex justify-center gap-1.5">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-[#E8630A] text-white' : 'bg-[#f7f8fa] text-[#94a3b8]'}`}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus Progress */}
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#0f172a]">{t('Syllabus Progress', 'पाठ्यक्रम प्रगति')}</h2>
                <span className="text-xs text-[#E8630A] font-semibold">38%</span>
              </div>
              <div className="flex flex-col gap-3">
                {subjects.map(s => (
                  <div key={s.en}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#374151] font-medium">{t(s.en, s.hi)}</span>
                      <span className="text-[#94a3b8]">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#94a3b8] mt-4 text-center">{t('Progress tracking coming soon', 'प्रगति ट्रैकिंग जल्द आएगी')}</p>
            </div>

            {/* Daily tip */}
            <div className="bg-gradient-to-br from-[#128807]/10 to-[#128807]/5 rounded-2xl border border-[#128807]/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-[#128807]" />
                <span className="text-xs font-bold text-[#128807]">{t("TODAY'S TIP", 'आज की सलाह')}</span>
              </div>
              <p className="text-sm text-[#0f172a] leading-relaxed">
                {t(
                  'Revise yesterday\'s notes for 15 minutes before starting new topics. Spaced repetition improves retention by 80%.',
                  'नया विषय शुरू करने से पहले कल के नोट्स 15 मिनट दोहराएं। Spaced repetition से याद 80% बेहतर होती है।'
                )}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
