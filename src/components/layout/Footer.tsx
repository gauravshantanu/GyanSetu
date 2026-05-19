'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-white border-t border-[#e8eaed] px-[5%] pt-12 pb-6">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[9px] bg-[#E8630A] flex items-center justify-content-center text-base">🌉</div>
              <div>
                <div className="font-display text-lg font-bold">Gyan<span className="text-[#E8630A]">Setu</span></div>
                <div className="font-hindi text-[10px] text-[#94a3b8]">ज्ञान सेतु</div>
              </div>
            </div>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-[210px]">
              {t("India's most complete free UPSC & NEET platform — in Hindi & English.", "हिंदी और अंग्रेज़ी में भारत का सबसे complete मुफ्त UPSC और NEET मंच।")}
            </p>
            <div className="flex gap-1 mt-3">
              <div className="h-1 w-8 rounded-sm bg-[#FF9933]" />
              <div className="h-1 w-8 rounded-sm bg-white border border-[#e8eaed]" />
              <div className="h-1 w-8 rounded-sm bg-[#128807]" />
            </div>
          </div>

          {/* Study */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3">{t('Study', 'अध्ययन')}</h4>
            {[
              ['/lectures', 'Video Lectures', 'वीडियो व्याख्यान'],
              ['/pyq', 'PYQ Bank', 'प्रश्न बैंक'],
              ['/mock-test', 'Mock Tests', 'मॉक टेस्ट'],
              ['/current-affairs', 'Current Affairs', 'समसामयिकी'],
              ['/ncert', 'NCERT Library', 'NCERT पुस्तकालय'],
            ].map(([href, en, hi]) => (
              <Link key={href} href={href} className="block text-sm text-[#64748b] no-underline mb-2 hover:text-[#E8630A] transition-colors">{t(en, hi)}</Link>
            ))}
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3">AI {t('Tools', 'उपकरण')}</h4>
            {[
              ['/ai-tutor', 'Doubt Solver', 'शंका समाधान'],
              ['/ai-tutor?mode=essay', 'Essay Evaluator', 'निबंध मूल्यांकन'],
              ['/ai-tutor?mode=quiz', 'Quiz Generator', 'प्रश्नोत्तरी'],
              ['/ai-tutor?mode=plan', 'Study Planner', 'अध्ययन योजना'],
            ].map(([href, en, hi]) => (
              <Link key={href} href={href} className="block text-sm text-[#64748b] no-underline mb-2 hover:text-[#E8630A] transition-colors">{t(en, hi)}</Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3">{t('Platform', 'मंच')}</h4>
            {[
              ['/about', 'About Us', 'हमारे बारे में'],
              ['/forum', 'Community Forum', 'समुदाय'],
              ['/toppers', 'Topper Stories', 'टॉपर की कहानियाँ'],
              ['/contact', 'Contact', 'संपर्क करें'],
              ['/privacy', 'Privacy Policy', 'गोपनीयता नीति'],
            ].map(([href, en, hi]) => (
              <Link key={href} href={href} className="block text-sm text-[#64748b] no-underline mb-2 hover:text-[#E8630A] transition-colors">{t(en, hi)}</Link>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e8eaed] pt-5 flex flex-wrap justify-between items-center gap-3 text-xs text-[#94a3b8]">
          <span>© 2025 GyanSetu · {t("Made with ❤️ for India's aspirants", "भारत के aspirants के लिए ❤️ से बनाया")}</span>
          <span>gyansetu.in · 100% Free · Powered by Gemini AI</span>
        </div>
      </div>
    </footer>
  )
}
