'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useLang } from '@/lib/lang-context'

export default function LoginPage() {
  const { t } = useLang()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(t(error.message, 'गलत ईमेल या पासवर्ड। दोबारा कोशिश करें।'))
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#f7f8fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 shadow-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-[14px] bg-[#E8630A] flex items-center justify-center text-2xl mx-auto mb-4">🌉</div>
            <h1 className="text-2xl font-bold text-[#0f172a] mb-1">
              {t('Welcome back', 'वापसी पर स्वागत है')}
            </h1>
            <p className="text-sm text-[#64748b]">
              {t('Log in to continue your UPSC/NEET prep', 'UPSC/NEET तैयारी जारी रखें')}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#e8eaed] rounded-xl px-4 py-3 text-sm font-semibold text-[#0f172a] bg-white hover:bg-[#f7f8fa] transition-colors disabled:opacity-60 cursor-pointer mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.174 0 7.548 0 9s.348 2.826.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            {googleLoading ? t('Redirecting…', 'जा रहे हैं…') : t('Continue with Google', 'Google से जारी रखें')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#e8eaed]" />
            <span className="text-xs text-[#94a3b8] font-medium">{t('or', 'या')}</span>
            <div className="flex-1 h-px bg-[#e8eaed]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#374151]">
                  {t('Password', 'पासवर्ड')}
                </label>
                <Link href="/forgot-password" className="text-xs text-[#E8630A] hover:underline">
                  {t('Forgot password?', 'पासवर्ड भूल गए?')}
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
              disabled={loading}
              className="w-full bg-[#E8630A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors disabled:opacity-60 cursor-pointer border-none mt-1"
            >
              {loading ? t('Logging in…', 'लॉगिन हो रहे हैं…') : t('Log in', 'लॉगिन करें')}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-[#64748b] mt-6">
            {t("Don't have an account?", 'खाता नहीं है?')}{' '}
            <Link href="/signup" className="text-[#E8630A] font-semibold hover:underline">
              {t('Sign up free', 'मुफ्त में जुड़ें')}
            </Link>
          </p>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-[#94a3b8] mt-4">
          {t('100% free · No credit card · Trusted by 50,000+ students', '100% मुफ्त · कोई शुल्क नहीं · 50,000+ छात्रों का विश्वास')}
        </p>
      </div>
    </div>
  )
}
