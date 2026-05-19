'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useLang } from '@/lib/lang-context'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false

type ExamGoal = 'UPSC' | 'NEET'

export default function SignupPage() {
  const { t, lang } = useLang()
  const router = useRouter()
  const [supabase] = useState(() => {
    if (!supabaseReady) return null
    try {
      const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
      return createClientComponentClient()
    } catch { return null }
  })

  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [examGoal, setExamGoal] = useState<ExamGoal | null>(null)
  const [examYear, setExamYear] = useState(new Date().getFullYear() + 1)
  const [prefLang, setPrefLang] = useState<'en' | 'hi'>(lang)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleGoogleSignup() {
    if (!supabase) return setError('Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL to .env.local')
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError(t('Password must be at least 8 characters', 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए'))
      return
    }
    setError('')
    setStep(2)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!examGoal) {
      setError(t('Please select your exam goal', 'कृपया अपना परीक्षा लक्ष्य चुनें'))
      return
    }
    if (!supabase) return setError('Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL to .env.local')
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, exam_goal: examGoal, exam_year: examYear, preferred_lang: prefLang },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Save profile — ignore error if students table not created yet
      try {
        await supabase.from('students').upsert({
          id: data.user.id,
          email,
          name,
          exam_goal: examGoal,
          exam_year: examYear,
          preferred_lang: prefLang,
          streak: 0,
        })
      } catch {}

      // If session exists → logged in directly, go to dashboard
      // If no session → email confirmation required
      if (data.session) {
        router.push('/')
        router.refresh()
      } else {
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i)

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#f7f8fa] flex items-center justify-center px-4 py-12">

      {/* Email confirmation popup */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)'}}>
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 shadow-xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-[#fff5ef] flex items-center justify-center text-3xl mx-auto mb-4">📧</div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">
              {t('Check your email!', 'अपना ईमेल देखें!')}
            </h2>
            <p className="text-sm text-[#64748b] mb-2">
              {t('We sent a confirmation link to', 'हमने confirmation link भेजा है')}
            </p>
            <p className="text-sm font-semibold text-[#E8630A] mb-5">{email}</p>
            <p className="text-xs text-[#94a3b8] mb-6">
              {t(
                'Click the link in the email to activate your account, then log in.',
                'ईमेल में दिए link पर क्लिक करें, फिर लॉगिन करें।'
              )}
            </p>
            <Link
              href="/login"
              className="block bg-[#E8630A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors no-underline"
            >
              {t('Go to Login →', 'लॉगिन पर जाएं →')}
            </Link>
            <p className="text-xs text-[#94a3b8] mt-3">
              {t("Didn't get it? Check spam folder.", 'नहीं मिला? Spam folder देखें।')}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[460px]">

        <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 shadow-sm">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-[14px] bg-[#E8630A] flex items-center justify-center text-2xl mx-auto mb-4">🌉</div>
            <h1 className="text-2xl font-bold text-[#0f172a] mb-1">
              {step === 1 ? t('Start your free journey', 'मुफ्त यात्रा शुरू करें') : t('Set your goal', 'लक्ष्य चुनें')}
            </h1>
            <p className="text-sm text-[#64748b]">
              {step === 1
                ? t('Join 50,000+ students preparing for UPSC & NEET', '50,000+ छात्रों के साथ UPSC/NEET की तैयारी करें')
                : t('Help us personalise your experience', 'आपका अनुभव बेहतर बनाने में मदद करें')}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#E8630A]' : 'bg-[#e8eaed]'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#E8630A]' : 'bg-[#e8eaed]'}`} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ── STEP 1: Account Details ── */}
          {step === 1 && (
            <>
              <button
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 border border-[#e8eaed] rounded-xl px-4 py-3 text-sm font-semibold text-[#0f172a] bg-white hover:bg-[#f7f8fa] transition-colors disabled:opacity-60 cursor-pointer mb-5"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.174 0 7.548 0 9s.348 2.826.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                </svg>
                {googleLoading ? t('Redirecting…', 'जा रहे हैं…') : t('Sign up with Google', 'Google से साइन अप करें')}
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#e8eaed]" />
                <span className="text-xs text-[#94a3b8] font-medium">{t('or', 'या')}</span>
                <div className="flex-1 h-px bg-[#e8eaed]" />
              </div>

              <form onSubmit={handleStep1} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    {t('Full name', 'पूरा नाम')}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder={t('Ravi Kumar', 'रवि कुमार')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    {t('Email address', 'ईमेल पता')}
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder={t('you@example.com', 'aap@example.com')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    {t('Password', 'पासवर्ड')}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder={t('Min. 8 characters', 'कम से कम 8 अक्षर')}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E8630A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors cursor-pointer border-none mt-1"
                >
                  {t('Continue →', 'आगे बढ़ें →')}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: Goal & Preferences ── */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="flex flex-col gap-5">

              {/* Exam Goal */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-3">
                  {t('I am preparing for', 'मैं तैयारी कर रहा/रही हूँ')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['UPSC', 'NEET'] as ExamGoal[]).map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setExamGoal(goal)}
                      className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                        examGoal === goal
                          ? 'border-[#E8630A] bg-[#fff5ef]'
                          : 'border-[#e8eaed] bg-white hover:border-[#E8630A]/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{goal === 'UPSC' ? '🏛️' : '🔬'}</div>
                      <div className="font-bold text-[#0f172a] text-sm">{goal}</div>
                      <div className="text-[10px] text-[#64748b] mt-0.5">
                        {goal === 'UPSC'
                          ? t('Civil Services', 'सिविल सेवा')
                          : t('Medical Entrance', 'मेडिकल प्रवेश')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Year */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  {t('Target exam year', 'लक्षित परीक्षा वर्ष')}
                </label>
                <select
                  value={examYear}
                  onChange={e => setExamYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/10 transition-all cursor-pointer"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  {t('Preferred study language', 'पसंदीदा अध्ययन भाषा')}
                </label>
                <div className="flex gap-3">
                  {(['en', 'hi'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setPrefLang(l)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all ${
                        prefLang === l
                          ? 'border-[#E8630A] bg-[#fff5ef] text-[#E8630A]'
                          : 'border-[#e8eaed] bg-white text-[#64748b] hover:border-[#E8630A]/40'
                      }`}
                    >
                      {l === 'en' ? 'English' : 'हिंदी'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-[#e8eaed] text-sm font-semibold text-[#64748b] bg-white hover:bg-[#f7f8fa] transition-colors cursor-pointer"
                >
                  {t('← Back', '← वापस')}
                </button>
                <button
                  type="submit"
                  disabled={loading || !examGoal}
                  className="flex-1 bg-[#E8630A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors disabled:opacity-60 cursor-pointer border-none"
                >
                  {loading ? t('Creating account…', 'खाता बन रहा है…') : t('Start learning →', 'सीखना शुरू करें →')}
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
          {step === 1 && (
            <p className="text-center text-sm text-[#64748b] mt-6">
              {t('Already have an account?', 'पहले से खाता है?')}{' '}
              <Link href="/login" className="text-[#E8630A] font-semibold hover:underline">
                {t('Log in', 'लॉगिन करें')}
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-4">
          {t('100% free · No credit card · No ads', '100% मुफ्त · कोई शुल्क नहीं · कोई विज्ञापन नहीं')}
        </p>
      </div>
    </div>
  )
}
