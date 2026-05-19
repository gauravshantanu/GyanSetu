'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'

const features = [
  { icon: '📺', en: 'Video Lectures', hi: 'वीडियो व्याख्यान', den: 'Chapter-wise lectures in Hindi & English. Plays on our site — never redirected.', dhi: 'हिंदी और अंग्रेज़ी में अध्यायवार व्याख्यान। हमारी साइट पर चलते हैं।', tag: 'free', href: '/lectures' },
  { icon: '📄', en: '10-Year PYQ Bank', hi: '10 साल का प्रश्न बैंक', den: 'Every Prelims & Mains paper in Hindi & English with full solutions.', dhi: 'हिंदी और अंग्रेज़ी में प्रीलिम्स और मेन्स के सभी प्रश्न पत्र।', tag: 'free', href: '/pyq' },
  { icon: '🤖', en: 'AI Doubt Solver', hi: 'AI शंका समाधान', den: 'Ask doubts in Hindi or English — get instant UPSC-specific answers 24/7.', dhi: 'हिंदी या अंग्रेज़ी में कोई भी शंका पूछें — 24/7 तुरंत उत्तर पाएँ।', tag: 'ai', href: '/ai-tutor' },
  { icon: '📝', en: 'Full Mock Tests', hi: 'पूर्ण मॉक टेस्ट', den: 'UPSC-pattern tests in Hindi & English with negative marking and all-India rank.', dhi: 'हिंदी और अंग्रेज़ी में UPSC पैटर्न के समयबद्ध मॉक टेस्ट।', tag: 'free', href: '/mock-test' },
  { icon: '📰', en: 'Daily Current Affairs', hi: 'दैनिक समसामयिकी', den: 'Daily digest in Hindi & English, tagged by GS paper with AI MCQs.', dhi: 'हिंदी और अंग्रेज़ी में दैनिक समाचार सारांश, GS पेपर के अनुसार।', tag: 'ai', href: '/current-affairs' },
  { icon: '✍️', en: 'Answer Evaluator', hi: 'उत्तर मूल्यांकन', den: 'Write UPSC answers in Hindi or English — get AI score and feedback.', dhi: 'हिंदी या अंग्रेज़ी में UPSC उत्तर लिखें — AI से तुरंत अंक पाएँ।', tag: 'ai', href: '/ai-tutor?mode=essay' },
]

const stats = [
  { num: '50,000+', en: 'Active students', hi: 'सक्रिय छात्र' },
  { num: '2,400+', en: 'Video lectures', hi: 'वीडियो व्याख्यान' },
  { num: '10 yrs', en: 'PYQ coverage', hi: 'प्रश्न पत्र' },
  { num: '₹0', en: 'Forever', hi: 'हमेशा' },
]

export default function HomePage() {
  const { t } = useLang()

  return (
    <div>
      {/* HERO */}
      <section className="px-[5%] py-[72px] pb-[60px] border-b border-[#e8eaed]">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="flex gap-1 mb-4">
              <div className="h-1 w-8 rounded-sm bg-[#FF9933]" />
              <div className="h-1 w-8 rounded-sm bg-white border border-[#eee]" />
              <div className="h-1 w-8 rounded-sm bg-[#128807]" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#fff4ee] border border-[#fde2cc] text-[#E8630A] px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
              <span className="text-[7px] animate-pulse">●</span>
              {t('100% Free · No hidden charges', '100% मुफ्त · कोई छुपा शुल्क नहीं')}
            </div>
            <h1 className="font-display text-[clamp(34px,4.2vw,56px)] font-black leading-[1.08] tracking-[-1.5px] mb-4">
              {t(
                <>Crack <em className="not-italic text-[#E8630A]">UPSC & NEET</em><br />the smart way</>,
                <><span className="font-hindi text-[clamp(30px,3.8vw,50px)] tracking-normal">UPSC & NEET<br /><em className="not-italic text-[#E8630A]">स्मार्ट तरीके से</em> क्रैक करें</span></>
              )}
            </h1>
            <p className="text-[15px] text-[#64748b] leading-[1.8] mb-7 max-w-[460px]">
              {t(
                'Video lectures, 10-year PYQ bank, AI doubt solver, mock tests — all in Hindi & English. No fees. No redirects.',
                'वीडियो व्याख्यान, 10 साल के प्रश्न पत्र, AI शंका समाधान, मॉक टेस्ट — हिंदी और अंग्रेज़ी दोनों में। बिल्कुल मुफ्त।'
              )}
            </p>
            <div className="flex gap-3 flex-wrap mb-9">
              <Link href="/signup" className="bg-[#E8630A] text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold no-underline hover:bg-[#c4520a] transition-colors">
                {t('Start Preparing Free →', 'मुफ्त तैयारी शुरू करें →')}
              </Link>
              <Link href="/lectures" className="bg-white text-[#0f172a] border border-[#d1d5db] px-6 py-3.5 rounded-[10px] text-[15px] font-medium no-underline hover:border-[#E8630A] hover:text-[#E8630A] transition-colors">
                {t('▶ Watch Lectures', '▶ व्याख्यान देखें')}
              </Link>
            </div>
            <div className="flex gap-6 pt-6 border-t border-[#e8eaed] flex-wrap">
              {stats.map(s => (
                <div key={s.num}>
                  <div className="font-display text-2xl font-bold">{s.num}</div>
                  <div className="text-xs text-[#64748b] mt-0.5">{t(s.en, s.hi)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white border border-[#e8eaed] rounded-[18px] overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
            <div className="bg-[#f7f8fa] border-b border-[#e8eaed] px-4 py-2.5 flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 bg-[#f0f2f5] rounded-md px-2.5 py-1 text-[11px] text-[#94a3b8] font-mono ml-2">gyansetu.in/dashboard</div>
            </div>
            <div className="p-4">
              <p className="text-[13px] text-[#64748b] mb-3">{t('Welcome back,', 'वापस आए,')} <strong className="text-[#E8630A]">{t('Rahul Kumar', 'राहुल कुमार')}</strong> 👋</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { l: t('Streak','स्ट्रीक'), v: '🔥 14', c: 'text-[#E8630A]' },
                  { l: t('All-India Rank','अखिल भारत रैंक'), v: '#847', c: 'text-[#1d4ed8]' },
                  { l: t('PYQs Solved','हल किए प्रश्न'), v: '1,240', c: 'text-[#128807]' },
                  { l: t('AI Doubts','AI शंकाएँ'), v: '38', c: 'text-[#E8630A]' },
                ].map(m => (
                  <div key={m.l} className="bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] p-3">
                    <div className="text-[10px] text-[#94a3b8] uppercase tracking-wide mb-1">{m.l}</div>
                    <div className={`text-lg font-bold font-display ${m.c}`}>{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] font-semibold text-[#64748b] mb-2">{t('Syllabus Progress', 'पाठ्यक्रम प्रगति')}</div>
              {[['GS Paper 1','GS पेपर 1','72%','#E8630A'],['GS Paper 2','GS पेपर 2','55%','#1d4ed8'],['GS Paper 3','GS पेपर 3','40%','#128807']].map(([en,hi,pct,col])=>(
                <div key={en} className="flex items-center gap-2 mb-1.5">
                  <div className="text-[10px] text-[#64748b] w-16 shrink-0">{t(en,hi)}</div>
                  <div className="flex-1 h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:pct,background:col}} />
                  </div>
                  <div className="text-[11px] w-7 text-right">{pct}</div>
                </div>
              ))}
              <div className="border-t border-[#e8eaed] mt-3 pt-3 flex flex-col gap-1.5">
                {[['📺',t('Indian Polity — Parliament','भारतीय राजनीति — संसद'),t('45 min ago','45 मिनट पहले')],
                  ['✅',t('UPSC 2022 Mock — 138/200','UPSC 2022 मॉक — 138/200'),t('2 hrs ago','2 घंटे पहले')],
                  ['🤖',t('AI explained 73rd Amendment','AI ने 73वाँ संशोधन समझाया'),t('Today','आज')]].map(([ic,tt,tm])=>(
                  <div key={tt} className="flex gap-2 items-center text-[11px] text-[#64748b]">
                    <div className="w-6 h-6 rounded-md bg-[#f0f2f5] flex items-center justify-center text-xs shrink-0">{ic}</div>
                    <div><strong className="text-[#0f172a] font-medium">{tt}</strong> · {tm}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-[5%] py-[72px] bg-[#f7f8fa]">
        <div className="max-w-[1140px] mx-auto">
          <span className="text-xs font-semibold text-[#E8630A] uppercase tracking-widest mb-2 block">{t("What's inside", 'क्या मिलेगा')}</span>
          <h2 className="font-display text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-0.7px] mb-3">{t('Everything a UPSC aspirant needs', 'UPSC aspirant को जो चाहिए')}</h2>
          <p className="text-sm text-[#64748b] leading-relaxed max-w-[500px] mb-10">{t('One platform. All subjects. Hindi & English both. No fees, no redirects.', 'एक मंच। सभी विषय। हिंदी और अंग्रेज़ी दोनों। कोई शुल्क नहीं।')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {features.map(f => (
              <Link key={f.href} href={f.href} className="no-underline">
                <div className="bg-white border border-[#e8eaed] rounded-[12px] p-5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all cursor-pointer h-full">
                  <span className="text-2xl mb-3 block">{f.icon}</span>
                  <div className="text-[15px] font-semibold mb-1.5">{t(f.en, f.hi)}</div>
                  <div className="text-[13px] text-[#64748b] leading-relaxed">{t(f.den, f.dhi)}</div>
                  <span className={`inline-block mt-2.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${f.tag === 'free' ? 'bg-[#edfaf0] text-[#128807]' : 'bg-[#eff6ff] text-[#1d4ed8]'}`}>
                    {f.tag === 'free' ? t('Free forever', 'हमेशा मुफ्त') : t('AI Powered', 'AI संचालित')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-[5%] py-[80px] border-t border-[#e8eaed] text-center">
        <div className="max-w-[500px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#fff4ee] border border-[#fde2cc] text-[#E8630A] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <span className="text-[7px]">●</span> {t('Join 50,000+ aspirants', '50,000+ aspirants से जुड़ें')}
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-black tracking-[-0.8px] mb-3 leading-[1.1]">
            {t('Start preparing today.', 'आज से तैयारी शुरू करें।')}<br />
            <span className="text-[#E8630A]">{t('Completely free.', 'बिल्कुल मुफ्त।')}</span>
          </h2>
          <p className="text-sm text-[#64748b] mb-8 leading-relaxed">{t("No credit card. No coaching fees. India's best free UPSC platform — in Hindi & English.", "कोई क्रेडिट कार्ड नहीं। हिंदी और अंग्रेज़ी में भारत का सबसे अच्छा मुफ्त UPSC मंच।")}</p>
          <div className="flex gap-2 max-w-[400px] mx-auto mb-4">
            <input type="email" placeholder={t('Enter your email', 'ईमेल पता दर्ज करें')} className="flex-1 border border-[#d1d5db] rounded-[10px] px-4 py-3 text-sm text-[#0f172a] outline-none focus:border-[#E8630A]" />
            <button className="bg-[#E8630A] text-white border-none px-5 py-3 rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#c4520a] transition-colors whitespace-nowrap">
              {t('Start Free →', 'शुरू करें →')}
            </button>
          </div>
          <p className="text-xs text-[#94a3b8]">{t('✓ Free forever · ✓ No spam · ✓ Hindi & English', '✓ हमेशा मुफ्त · ✓ स्पैम नहीं · ✓ हिंदी और अंग्रेज़ी')}</p>
        </div>
      </section>
    </div>
  )
}
