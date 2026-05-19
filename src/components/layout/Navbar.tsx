'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/lib/lang-context'

const navLinks = [
  { href: '/lectures',        en: 'Lectures',        hi: 'व्याख्यान' },
  { href: '/pyq',             en: 'PYQ Bank',        hi: 'प्रश्न बैंक' },
  { href: '/ai-tutor',        en: 'AI Tutor',        hi: 'AI शिक्षक' },
  { href: '/mock-test',       en: 'Mock Tests',      hi: 'मॉक टेस्ट' },
  { href: '/current-affairs', en: 'Current Affairs', hi: 'समसामयिकी' },
]

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

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
        </div>
      )}
    </>
  )
}
