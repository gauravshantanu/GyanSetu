'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useLang } from '@/lib/lang-context'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false

function getSupabaseClient() {
  if (!supabaseReady) return null
  try {
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
    return createClientComponentClient()
  } catch { return null }
}

const navLinks = [
  { href: '/lectures',        en: 'Lectures',        hi: 'व्याख्यान' },
  { href: '/pyq',             en: 'PYQ Bank',        hi: 'प्रश्न बैंक' },
  { href: '/ai-tutor',        en: 'AI Tutor',        hi: 'AI शिक्षक' },
  { href: '/mock-test',       en: 'Mock Tests',      hi: 'मॉक टेस्ट' },
  { href: '/current-affairs', en: 'Current Affairs', hi: 'समसामयिकी' },
]

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [supabase] = useState(() => getSupabaseClient())

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }: any) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleLogout() {
    await supabase?.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-[5%] h-[62px] bg-white/95 backdrop-blur-md border-b border-[#e8eaed]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-[10px] bg-[#E8630A] flex items-center justify-center text-lg">🌉</div>
          <div>
            <div className="font-display text-[19px] font-bold text-[#0f172a]">
              Gyan<span className="text-[#E8630A]">Setu</span>
            </div>
            <div className="font-hindi text-[10px] text-[#94a3b8] leading-none">ज्ञान सेतु</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-6 list-none">
          {navLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-[#64748b] no-underline text-sm font-medium hover:text-[#E8630A] transition-colors">
                {t(l.en, l.hi)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex items-center bg-[#f7f8fa] border border-[#e8eaed] rounded-full p-[3px] gap-[2px]">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-[5px] rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${lang === 'en' ? 'bg-[#E8630A] text-white' : 'bg-transparent text-[#64748b]'}`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-[5px] rounded-full text-xs font-semibold border-none cursor-pointer transition-all font-hindi ${lang === 'hi' ? 'bg-[#E8630A] text-white' : 'bg-transparent text-[#64748b]'}`}
            >
              हिंदी
            </button>
          </div>

          {user ? (
            /* Logged in — avatar + dropdown */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-1 rounded-xl hover:bg-[#f7f8fa] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8630A] text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[#0f172a] max-w-[90px] truncate">{displayName}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#e8eaed] shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0f172a] hover:bg-[#f7f8fa] no-underline transition-colors"
                  >
                    <LayoutDashboard size={14} className="text-[#64748b]" />
                    {t('Dashboard', 'डैशबोर्ड')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 bg-transparent border-none cursor-pointer transition-colors"
                  >
                    <LogOut size={14} />
                    {t('Log out', 'लॉगआउट')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged out — Login + Start Free */
            <>
              <Link href="/login">
                <button className="bg-transparent border border-[#d1d5db] text-[#0f172a] px-4 py-[7px] rounded-lg text-sm font-medium cursor-pointer hover:border-[#E8630A] hover:text-[#E8630A] transition-all">
                  {t('Log in', 'लॉगिन')}
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-[#E8630A] text-white border-none px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#c4520a] transition-colors">
                  {t('Start Free →', 'शुरू करें →')}
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden bg-transparent border-none cursor-pointer text-[#0f172a]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden sticky top-[62px] z-40 bg-white border-b border-[#e8eaed] px-[5%] py-4 flex flex-col gap-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-[#64748b] no-underline text-sm font-medium" onClick={() => setMenuOpen(false)}>
              {t(l.en, l.hi)}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer ${lang === 'en' ? 'bg-[#E8630A] text-white border-[#E8630A]' : 'bg-white text-[#64748b] border-[#e8eaed]'}`}>English</button>
            <button onClick={() => setLang('hi')} className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer font-hindi ${lang === 'hi' ? 'bg-[#E8630A] text-white border-[#E8630A]' : 'bg-white text-[#64748b] border-[#e8eaed]'}`}>हिंदी</button>
          </div>
          {user ? (
            <div className="flex flex-col gap-1 pt-2 border-t border-[#e8eaed] mt-1">
              <Link href="/dashboard" className="text-sm text-[#0f172a] font-medium no-underline py-1" onClick={() => setMenuOpen(false)}>
                {t('Dashboard', 'डैशबोर्ड')}
              </Link>
              <button onClick={handleLogout} className="text-left text-sm text-red-600 bg-transparent border-none cursor-pointer py-1">
                {t('Log out', 'लॉगआउट')}
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-[#e8eaed] mt-1">
              <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2 rounded-lg border border-[#e8eaed] text-sm font-semibold text-[#0f172a] bg-white cursor-pointer">
                  {t('Log in', 'लॉगिन')}
                </button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2 rounded-lg bg-[#E8630A] text-white text-sm font-semibold border-none cursor-pointer">
                  {t('Start Free', 'शुरू करें')}
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
