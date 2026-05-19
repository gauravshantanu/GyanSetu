'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/lang-context'

const questionsEn = [
  { q: "With reference to the economic history of medieval India, the term 'Araghatta' refers to which of the following?", opts: ["A type of irrigation device used to lift water","A system of land revenue collection","A market place for selling agricultural products","A unit of weight measurement for grains"], ans: 0, sub: "History" },
  { q: "Which of the following is NOT a feature of the Indian Federal System?", opts: ["Dual government","Single citizenship","Flexible Constitution","Independent Judiciary"], ans: 2, sub: "Polity" },
  { q: "The 'Namdapha National Park' is located in which state?", opts: ["Assam","Nagaland","Arunachal Pradesh","Manipur"], ans: 2, sub: "Geography" },
]
const questionsHi = [
  { q: "मध्यकालीन भारत के आर्थिक इतिहास के संदर्भ में, 'अरघट्ट' शब्द निम्नलिखित में से किसे संदर्भित करता है?", opts: ["पानी उठाने के लिए प्रयुक्त सिंचाई यंत्र","भू-राजस्व संग्रह की पद्धति","कृषि उत्पादों के लिए बाज़ार स्थल","अनाज के लिए भार मापन इकाई"], ans: 0, sub: "इतिहास" },
  { q: "निम्नलिखित में से कौन सा भारतीय संघीय व्यवस्था की विशेषता नहीं है?", opts: ["दोहरी सरकार","एकल नागरिकता","लचीला संविधान","स्वतंत्र न्यायपालिका"], ans: 2, sub: "राजव्यवस्था" },
  { q: "'नामदाफा राष्ट्रीय उद्यान' किस राज्य में स्थित है?", opts: ["असम","नागालैंड","अरुणाचल प्रदेश","मणिपुर"], ans: 2, sub: "भूगोल" },
]

export default function MockTestPage() {
  const { t, lang } = useLang()
  const [testLang, setTestLang] = useState<'en'|'hi'>('hi')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<Record<number,number>>({})
  const [timeLeft, setTimeLeft] = useState(7200)
  const [started, setStarted] = useState(false)

  const questions = testLang === 'hi' ? questionsHi : questionsEn

  useEffect(() => {
    if (!started) return
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [started])

  const fmt = (s: number) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const correct = Object.entries(selected).filter(([qi,oi]) => questions[+qi]?.ans === oi).length
  const wrong = Object.keys(selected).length - correct
  const score = (correct * 2) - (wrong * 0.67)

  if (!started) return (
    <div className="px-[5%] py-16 min-h-screen bg-[#f7f8fa] flex items-center justify-center">
      <div className="bg-white border border-[#e8eaed] rounded-[18px] p-10 max-w-[500px] w-full text-center shadow-sm">
        <div className="text-4xl mb-4">📝</div>
        <h1 className="font-display text-2xl font-bold mb-2">{t('UPSC Prelims Mock Test', 'UPSC प्रीलिम्स मॉक टेस्ट')}</h1>
        <p className="text-sm text-[#64748b] mb-6">{t('100 questions · 2 hours · Negative marking', '100 प्रश्न · 2 घंटे · नकारात्मक अंकन')}</p>
        <div className="flex gap-2 justify-center mb-6">
          <span className="text-sm font-semibold text-[#64748b]">{t('Test language:', 'परीक्षा भाषा:')}</span>
          <button onClick={() => setTestLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${testLang==='en'?'bg-[#E8630A] text-white border-[#E8630A]':'border-[#e8eaed] text-[#64748b]'}`}>English</button>
          <button onClick={() => setTestLang('hi')} className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer font-hindi ${testLang==='hi'?'bg-[#E8630A] text-white border-[#E8630A]':'border-[#e8eaed] text-[#64748b]'}`}>हिंदी</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-8">
          {[[t('Total Questions','कुल प्रश्न'),'100'],[t('Duration','अवधि'),t('2 Hours','2 घंटे')],[t('Correct marks','सही अंक'),'+2'],[t('Wrong marks','गलत अंक'),'-0.67']].map(([l,v])=>(
            <div key={l} className="bg-[#f7f8fa] rounded-xl p-3"><div className="text-xs text-[#94a3b8]">{l}</div><div className="font-bold text-[#0f172a]">{v}</div></div>
          ))}
        </div>
        <button onClick={() => setStarted(true)} className="bg-[#E8630A] text-white border-none px-8 py-3.5 rounded-xl text-base font-bold cursor-pointer hover:bg-[#c4520a] transition-colors w-full">
          {t('Start Test →', 'टेस्ट शुरू करें →')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="px-[5%] py-8 bg-[#f7f8fa] min-h-screen">
      <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Question card */}
        <div className="bg-white border border-[#e8eaed] rounded-[18px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#e8eaed] flex justify-between items-center">
            <span className="text-sm font-semibold">{t('UPSC Prelims 2024 · GS Paper 1', 'UPSC प्रीलिम्स 2024 · GS पेपर 1')}</span>
            <span className="font-mono text-base font-bold text-[#E8630A] bg-[#fff4ee] border border-[#fde2cc] px-3 py-1 rounded-lg">{fmt(timeLeft)}</span>
          </div>
          <div className="p-6">
            <div className="text-xs text-[#94a3b8] font-semibold uppercase tracking-wider mb-3">{t('Question','प्रश्न')} {current+1} / {questions.length} · {questions[current].sub}</div>
            <p className={`text-[15px] leading-relaxed mb-5 ${testLang==='hi'?'font-hindi text-base':''}`}>{questions[current].q}</p>
            <div className="flex flex-col gap-2">
              {questions[current].opts.map((opt,i)=>(
                <div key={i} onClick={() => setSelected(prev => ({...prev,[current]:i}))}
                  className={`flex items-center gap-2.5 px-4 py-3.5 border rounded-xl cursor-pointer text-sm transition-all ${testLang==='hi'?'font-hindi text-[15px]':''} ${selected[current]===i?'border-[#E8630A] bg-[#fff4ee] text-[#E8630A] font-medium':'border-[#e8eaed] bg-[#f7f8fa] hover:border-[#d1d5db] hover:bg-[#f0f2f5]'}`}>
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold font-mono shrink-0 ${selected[current]===i?'bg-[#E8630A] border-[#E8630A] text-white':'bg-white border-[#e8eaed] text-[#64748b]'}`}>
                    {String.fromCharCode(65+i)}
                  </div>
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 py-3.5 border-t border-[#e8eaed] flex justify-between items-center">
            <span className="text-xs text-[#64748b]">{Object.keys(selected).length} {t('answered','उत्तरित')} · {questions.length - Object.keys(selected).length} {t('remaining','शेष')}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrent(c => Math.max(0,c-1))} disabled={current===0} className="px-4 py-2 bg-[#f7f8fa] border border-[#e8eaed] text-[#64748b] rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40">← {t('Prev','पिछला')}</button>
              <button onClick={() => setCurrent(c => Math.min(questions.length-1,c+1))} disabled={current===questions.length-1} className="px-4 py-2 bg-[#E8630A] text-white border-none rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-40">{t('Next','अगला')} →</button>
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-col gap-3">
          {/* Score */}
          <div className="bg-white border border-[#e8eaed] rounded-xl p-4">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{t('Live Score','लाइव अंक')}</div>
            <div className="flex justify-between text-sm mb-1.5"><span>{t('Correct','सही')}</span><span className="text-[#128807] font-semibold">{correct}</span></div>
            <div className="flex justify-between text-sm mb-1.5"><span>{t('Wrong','गलत')}</span><span className="text-red-600 font-semibold">{wrong}</span></div>
            <div className="flex justify-between text-sm mb-3"><span>{t('Net score','कुल अंक')}</span><span className="text-[#E8630A] font-bold">{score.toFixed(1)}</span></div>
            <div className="h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
              <div className="h-full bg-[#128807] rounded-full transition-all" style={{width:`${correct>0?(correct/(correct+wrong))*100:0}%`}} />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white border border-[#e8eaed] rounded-xl p-4">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{t('Live Leaderboard','लाइव लीडरबोर्ड')}</div>
            {[['🥇','Priya Sharma','187.5'],['🥈','Arjun Mehta','183.0'],['🥉','Sneha Patel','179.5']].map(([rank,name,sc])=>(
              <div key={name} className="flex items-center gap-2.5 py-2 border-b border-[#e8eaed] text-sm">
                <span className="text-base">{rank}</span><span className="flex-1">{name}</span><span className="text-[#1d4ed8] font-semibold text-xs">{sc}</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5 py-2 text-sm">
              <span className="text-xs font-bold text-[#E8630A]">#847</span>
              <span className="flex-1 font-semibold text-[#E8630A]">{t('You','आप')}</span>
              <span className="text-[#E8630A] font-semibold text-xs">{score.toFixed(1)}</span>
            </div>
          </div>

          {/* Question palette */}
          <div className="bg-white border border-[#e8eaed] rounded-xl p-4">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{t('Question Palette','प्रश्न पट्टिका')}</div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((_,i)=>(
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${i===current?'border-[#E8630A] bg-[#E8630A] text-white':selected[i]!==undefined?'border-[#128807] bg-[#edfaf0] text-[#128807]':'border-[#e8eaed] bg-[#f7f8fa] text-[#64748b] hover:border-[#E8630A]'}`}>
                  {i+1}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-3 text-[10px] text-[#64748b]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#edfaf0] border border-[#128807] inline-block"/> {t('Answered','उत्तरित')}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#f7f8fa] border border-[#e8eaed] inline-block"/> {t('Not visited','नहीं देखे')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
