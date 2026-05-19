'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'

const pyqEn = [
  { q:"With reference to Indian history, 'Araghatta' was a type of irrigation device used to lift water from wells. Which medieval dynasty promoted its use extensively?", opts:["Cholas","Vijayanagara Empire","Delhi Sultanate","Mughal Empire"], ans:2, yr:2023, tags:['GS1','History'] },
  { q:"The 73rd Constitutional Amendment (1992) added which schedule to the Indian Constitution relating to Panchayati Raj institutions?", opts:["10th Schedule","11th Schedule","12th Schedule","13th Schedule"], ans:1, yr:2022, tags:['GS2','Polity'] },
  { q:"Which of the following National Parks is located in the Charaideo district of Assam?", opts:["Kaziranga NP","Manas NP","Dibru-Saikhowa NP","Dehing Patkai NP"], ans:3, yr:2023, tags:['GS1','Geography'] },
  { q:"Consider the following statements about India's current account: 1. Services exports are a major component. 2. Remittances from abroad are included in the current account. Which is/are correct?", opts:["1 only","2 only","Both 1 and 2","Neither 1 nor 2"], ans:2, yr:2024, tags:['GS3','Economy'] },
]
const pyqHi = [
  { q:"भारतीय इतिहास के संदर्भ में, 'अरघट्ट' कुओं से पानी उठाने के लिए प्रयुक्त एक सिंचाई यंत्र था। किस मध्यकालीन राजवंश ने इसका व्यापक उपयोग को बढ़ावा दिया?", opts:["चोल","विजयनगर साम्राज्य","दिल्ली सल्तनत","मुगल साम्राज्य"], ans:2, yr:2023, tags:['GS1','इतिहास'] },
  { q:"73वें संवैधानिक संशोधन (1992) ने पंचायती राज संस्थाओं से संबंधित भारतीय संविधान में कौन सी अनुसूची जोड़ी?", opts:["10वीं अनुसूची","11वीं अनुसूची","12वीं अनुसूची","13वीं अनुसूची"], ans:1, yr:2022, tags:['GS2','राजव्यवस्था'] },
  { q:"निम्नलिखित में से कौन सा राष्ट्रीय उद्यान असम के चराईदेव ज़िले में स्थित है?", opts:["काज़ीरंगा NP","मानस NP","डिब्रू-सैखोवा NP","देहिंग पटकाई NP"], ans:3, yr:2023, tags:['GS1','भूगोल'] },
  { q:"भारत के चालू खाते के बारे में निम्न कथनों पर विचार करें: 1. सेवा निर्यात एक प्रमुख घटक है। 2. विदेश से प्रेषण चालू खाते में शामिल है। कौन सा/से सही है/हैं?", opts:["केवल 1","केवल 2","1 और 2 दोनों","न तो 1 न ही 2"], ans:2, yr:2024, tags:['GS3','अर्थव्यवस्था'] },
]

export default function PYQPage() {
  const { t } = useLang()
  const [pyqLang, setPyqLang] = useState<'en'|'hi'>('hi')
  const [selected, setSelected] = useState<Record<number,number>>({})
  const [yearFilter, setYearFilter] = useState<number[]>([2023,2024])

  const data = pyqLang === 'hi' ? pyqHi : pyqEn
  const filtered = data.filter(q => yearFilter.length === 0 || yearFilter.includes(q.yr))

  const toggleYear = (y: number) => setYearFilter(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y])

  const checkAns = (qi: number, oi: number) => {
    if (selected[qi] !== undefined) return
    setSelected(prev => ({ ...prev, [qi]: oi }))
  }

  return (
    <div className="px-[5%] py-10 min-h-screen">
      <div className="max-w-[1140px] mx-auto">
        <span className="text-xs font-semibold text-[#E8630A] uppercase tracking-widest mb-2 block">{t('PYQ Bank', 'प्रश्न बैंक')}</span>
        <h1 className="font-display text-3xl font-bold mb-1">{t('10 Years of Questions. Hindi & English.', '10 साल के प्रश्न। हिंदी और अंग्रेज़ी।')}</h1>
        <p className="text-sm text-[#64748b] mb-6">{t('Click an option to check your answer instantly.', 'उत्तर जाँचने के लिए विकल्प पर क्लिक करें।')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
          {/* Filters */}
          <div className="bg-white border border-[#e8eaed] rounded-xl p-4 h-fit">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{t('Filters', 'फ़िल्टर')}</div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#64748b] mb-2">{t('Language', 'भाषा')}</div>
              <button onClick={() => setPyqLang('en')} className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 border cursor-pointer ${pyqLang==='en'?'bg-[#fff4ee] border-[#fde2cc] text-[#E8630A] font-medium':'border-transparent text-[#64748b] hover:bg-[#f7f8fa]'}`}>English</button>
              <button onClick={() => setPyqLang('hi')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-hindi border cursor-pointer ${pyqLang==='hi'?'bg-[#fff4ee] border-[#fde2cc] text-[#E8630A] font-medium':'border-transparent text-[#64748b] hover:bg-[#f7f8fa]'}`}>हिंदी</button>
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#64748b] mb-2">{t('Year', 'वर्ष')}</div>
              {[2024,2023,2022,2021,2020].map(y => (
                <label key={y} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 border ${yearFilter.includes(y)?'bg-[#fff4ee] border-[#fde2cc] text-[#E8630A]':'border-transparent text-[#64748b] hover:bg-[#f7f8fa]'}`}>
                  <input type="checkbox" checked={yearFilter.includes(y)} onChange={() => toggleYear(y)} className="accent-[#E8630A]" /> {y}
                </label>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#64748b] mb-2">{t('Paper', 'पेपर')}</div>
              {['Prelims GS1','Mains GS1','Mains GS2','Mains GS3'].map(p => (
                <label key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer mb-1 text-[#64748b] hover:bg-[#f7f8fa]">
                  <input type="radio" name="paper" className="accent-[#E8630A]" /> {p}
                </label>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-3">
            {filtered.map((item, qi) => (
              <div key={qi} className="bg-white border border-[#e8eaed] rounded-xl p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <span className={`text-sm leading-relaxed flex-1 ${pyqLang==='hi'?'font-hindi text-[15px]':''}`}>{item.q}</span>
                  <span className="text-xs font-semibold text-[#E8630A] bg-[#fff4ee] px-2.5 py-1 rounded-lg shrink-0">UPSC {item.yr}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {item.opts.map((opt, oi) => (
                    <div key={oi} onClick={() => checkAns(qi, oi)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 border rounded-lg text-sm cursor-pointer transition-all ${pyqLang==='hi'?'font-hindi text-[14px]':''} ${selected[qi]===undefined?'border-[#e8eaed] bg-[#f7f8fa] hover:border-[#d1d5db]':selected[qi]===oi&&oi===item.ans?'border-[#128807] bg-[#edfaf0] text-[#128807]':selected[qi]===oi?'border-red-400 bg-red-50 text-red-600':oi===item.ans&&selected[qi]!==undefined?'border-[#128807] bg-[#edfaf0] text-[#128807]':'border-[#e8eaed] bg-[#f7f8fa] text-[#94a3b8]'}`}>
                      <span className="font-mono font-bold text-xs shrink-0">{String.fromCharCode(65+oi)}.</span> {opt}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map(tag => <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#f7f8fa] border border-[#e8eaed] text-[#64748b]">{tag}</span>)}
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#f7f8fa] border border-[#e8eaed] text-[#64748b]">Prelims</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
