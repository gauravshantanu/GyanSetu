'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import { CheckCircle2, Bookmark, Download, BookOpen } from 'lucide-react'

const lectures = [
  { id:1, en:'Introduction to Indian Constitution', hi:'भारतीय संविधान का परिचय', dur:38, lang:'hi', done:true, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:2, en:'Constituent Assembly & Preamble', hi:'संविधान सभा एवं प्रस्तावना', dur:44, lang:'hi', done:true, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:3, en:'Fundamental Rights — Part I', hi:'मौलिक अधिकार — भाग I', dur:58, lang:'hi', done:true, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:4, en:'Fundamental Rights — Part II', hi:'मौलिक अधिकार — भाग II', dur:51, lang:'en', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:5, en:'Directive Principles of State Policy', hi:'राज्य के नीति निदेशक तत्व', dur:42, lang:'bi', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:6, en:'Fundamental Duties', hi:'मौलिक कर्तव्य', dur:28, lang:'hi', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:7, en:'Union Executive — President', hi:'संघीय कार्यपालिका — राष्ट्रपति', dur:55, lang:'hi', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:8, en:'Parliament & Its Functions', hi:'संसद एवं उसके कार्य', dur:52, lang:'hi', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
  { id:9, en:'Judiciary — Supreme Court', hi:'न्यायपालिका — सर्वोच्च न्यायालय', dur:61, lang:'hi', done:false, vid:'dQw4w9WgXcQ', gs:'GS2' },
]

const langBadge = { hi: 'bg-[#fff4ee] text-[#E8630A]', en: 'bg-[#eff6ff] text-[#1d4ed8]', bi: 'bg-[#edfaf0] text-[#128807]' }
const langLabel = { hi: {en:'Hindi',hi:'हिंदी'}, en: {en:'English',hi:'English'}, bi: {en:'Bilingual',hi:'द्विभाषी'} }

export default function LecturesPage() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(lectures[7])
  const [playing, setPlaying] = useState(false)
  const [filter, setFilter] = useState<'all'|'hi'|'en'|'bi'>('all')
  const [search, setSearch] = useState('')

  const filtered = lectures.filter(l =>
    (filter === 'all' || l.lang === filter) &&
    (l.en.toLowerCase().includes(search.toLowerCase()) || l.hi.includes(search))
  )

  return (
    <div className="px-[5%] py-10 bg-[#f7f8fa] min-h-screen">
      <div className="max-w-[1140px] mx-auto">
        <span className="text-xs font-semibold text-[#E8630A] uppercase tracking-widest mb-2 block">{t('Video Lectures', 'वीडियो व्याख्यान')}</span>
        <h1 className="font-display text-3xl font-bold mb-1">{t('Watch. Learn. Progress.', 'देखें। सीखें। आगे बढ़ें।')}</h1>
        <p className="text-sm text-[#64748b] mb-6">{t('All lectures play on our site. Your progress is saved automatically.', 'सभी व्याख्यान हमारी साइट पर चलते हैं। आपकी प्रगति स्वतः सहेजी जाती है।')}</p>

        {/* Language filter bar */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-white border border-[#e8eaed] rounded-xl flex-wrap">
          <span className="text-sm font-semibold text-[#64748b]">{t('Show lectures in:', 'भाषा चुनें:')}</span>
          {(['all','hi','en','bi'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${filter === f ? 'bg-[#E8630A] text-white border-[#E8630A]' : 'bg-white text-[#64748b] border-[#e8eaed] hover:border-[#E8630A] hover:text-[#E8630A]'}`}>
              {f === 'all' ? t('All', 'सभी') : f === 'hi' ? 'हिंदी माध्यम' : f === 'en' ? 'English Medium' : t('Bilingual', 'द्विभाषी')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Video Player */}
          <div className="bg-white border border-[#e8eaed] rounded-[18px] overflow-hidden">
            {playing ? (
              <iframe src={`https://www.youtube.com/embed/${active.vid}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full aspect-video border-none" allowFullScreen allow="autoplay" />
            ) : (
              <div className="aspect-video bg-[#0f172a] flex flex-col items-center justify-center gap-3 cursor-pointer group" onClick={() => setPlaying(true)}>
                <div className="w-14 h-14 rounded-full bg-[#E8630A] flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">▶</div>
                <p className="text-white/60 text-sm text-center px-6">{lang === 'hi' ? active.hi : active.en}</p>
              </div>
            )}
            <div className="p-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 inline-block ${langBadge[active.lang]}`}>
                {lang === 'hi' ? langLabel[active.lang].hi : langLabel[active.lang].en}
              </span>
              <h2 className={`text-base font-semibold mb-2 ${lang === 'hi' ? 'font-hindi text-lg' : ''}`}>{lang === 'hi' ? active.hi : active.en}</h2>
              <div className="text-xs text-[#64748b] flex gap-4 mb-3">
                <span>📚 {active.gs}</span>
                <span>⏱ {active.dur} {t('min','मिनट')}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-[#e8eaed] flex-wrap">
                {[[BookOpen,t('Notes','नोट्स')],[Bookmark,t('Bookmark','बुकमार्क')],[CheckCircle2,t('Mark Done','पूर्ण करें')],[Download,t('PDF Notes','PDF नोट्स')]].map(([Icon,label])=>(
                  <button key={label} className="flex items-center gap-1.5 bg-[#f7f8fa] border border-[#e8eaed] text-[#64748b] px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:border-[#E8630A] hover:text-[#E8630A] hover:bg-[#fff4ee] transition-all">
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-white border border-[#e8eaed] rounded-[18px] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e8eaed] flex justify-between items-center">
              <span className="text-sm font-semibold">{t('GS Paper 2 — Polity', 'GS पेपर 2 — राजव्यवस्था')}</span>
              <span className="text-xs text-[#94a3b8]">{filtered.length} {t('lectures','व्याख्यान')}</span>
            </div>
            <div className="px-3 py-2 border-b border-[#e8eaed]">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('🔍 Search...', '🔍 खोजें...')}
                className="w-full bg-[#f7f8fa] border border-[#e8eaed] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#E8630A]" />
            </div>
            <div className="max-h-[460px] overflow-y-auto">
              {filtered.map(l => (
                <div key={l.id} onClick={() => { setActive(l); setPlaying(true); }}
                  className={`flex items-center gap-2.5 px-4 py-3 border-b border-[#e8eaed] cursor-pointer transition-colors ${active.id === l.id ? 'bg-[#fff4ee] border-l-2 border-l-[#E8630A]' : 'hover:bg-[#f7f8fa]'}`}>
                  <div className="text-xs text-[#94a3b8] w-5 shrink-0">{l.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${lang === 'hi' ? 'font-hindi text-sm' : ''}`}>{lang === 'hi' ? l.hi : l.en}</div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">⏱ {l.dur} {t('min','मिनट')}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${langBadge[l.lang]}`}>
                    {l.lang === 'hi' ? 'HI' : l.lang === 'en' ? 'EN' : 'BI'}
                  </span>
                  {l.done && <CheckCircle2 size={14} className="text-[#128807] shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
