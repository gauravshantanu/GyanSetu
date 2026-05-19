'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'

const caItems = [
  { date:'19 May 2025', paper:'GS2', en:{ h:'Centre launches PM Internship Scheme for 1 crore youth', p:'The government announced a major internship scheme for unemployed youth aged 21–24, offering ₹5,000/month stipend across India\'s top 500 companies. This is linked to the Union Budget 2024-25 announcement.' }, hi:{ h:'केंद्र ने 1 करोड़ युवाओं के लिए PM इंटर्नशिप योजना शुरू की', p:'सरकार ने 21-24 वर्ष के बेरोजगार युवाओं के लिए बड़ी इंटर्नशिप योजना की घोषणा की, जिसमें भारत की शीर्ष 500 कंपनियों में ₹5,000/माह वजीफा मिलेगा।' }, mcqs:3 },
  { date:'18 May 2025', paper:'GS3', en:{ h:"India's current account deficit narrows to 0.7% of GDP in Q3", p:'RBI data shows the current account deficit has narrowed significantly, supported by strong services exports and record remittances of $32 billion in the quarter. Key topic for Economy GS3.' }, hi:{ h:'भारत का चालू खाता घाटा GDP के 0.7% तक सिकुड़ा', p:'RBI के आँकड़ों से पता चला कि मजबूत सेवा निर्यात और रिकॉर्ड $32 अरब प्रेषण के कारण चालू खाता घाटा कम हुआ। GS3 अर्थव्यवस्था के लिए महत्वपूर्ण विषय।' }, mcqs:3 },
  { date:'17 May 2025', paper:'GS1', en:{ h:'UNESCO inscribes Moidams of Assam as World Heritage Site', p:'The Moidams — burial mounds of the Ahom dynasty in Assam\'s Charaideo district — become India\'s 43rd UNESCO World Heritage Site. Important for Art & Culture GS1.' }, hi:{ h:'UNESCO ने असम के मोइदाम को विश्व धरोहर घोषित किया', p:'असम के चराईदेव ज़िले में अहोम राजवंश के दफन टीले "मोइदाम" भारत का 43वाँ UNESCO विश्व धरोहर स्थल बने। GS1 कला व संस्कृति के लिए महत्वपूर्ण।' }, mcqs:3 },
  { date:'16 May 2025', paper:'GS2', en:{ h:"Supreme Court upholds Electoral Bond scheme struck down earlier", p:'The Supreme Court Constitution Bench delivered an important verdict on electoral bonds. The ruling has major implications for transparency in political funding.' }, hi:{ h:'सर्वोच्च न्यायालय का चुनावी बॉन्ड पर महत्वपूर्ण निर्णय', p:'सर्वोच्च न्यायालय की संविधान पीठ ने चुनावी बॉन्ड पर महत्वपूर्ण फैसला सुनाया। इसका राजनीतिक वित्त पारदर्शिता पर बड़ा प्रभाव है।' }, mcqs:3 },
  { date:'15 May 2025', paper:'GS3', en:{ h:'India launches first indigenous quantum computer with 1000 qubits', p:'The Department of Science and Technology unveiled India\'s first indigenously developed quantum computer. A breakthrough for Digital India and Make in India missions.' }, hi:{ h:'भारत ने 1000 क्यूबिट का पहला स्वदेशी क्वांटम कंप्यूटर लॉन्च किया', p:'विज्ञान एवं प्रौद्योगिकी विभाग ने भारत का पहला स्वदेश निर्मित क्वांटम कंप्यूटर लॉन्च किया। डिजिटल इंडिया के लिए ऐतिहासिक उपलब्धि।' }, mcqs:3 },
  { date:'14 May 2025', paper:'GS1', en:{ h:"India's population reaches 1.45 billion, overtaking China officially", p:'The UN Population Fund confirmed India as the world\'s most populous country with 1.45 billion people. Demographic dividend and challenges are key UPSC topics.' }, hi:{ h:'भारत की जनसंख्या 1.45 अरब, चीन को पीछे छोड़ा', p:'UN जनसंख्या कोष ने पुष्टि की कि भारत 1.45 अरब लोगों के साथ दुनिया का सबसे अधिक आबादी वाला देश है।' }, mcqs:3 },
]

const paperColor: Record<string,string> = { GS1:'#fff0f6', GS2:'#eff6ff', GS3:'#fff7ed', GS4:'#f0fdf4' }
const paperText: Record<string,string> = { GS1:'#be185d', GS2:'#1d4ed8', GS3:'#c2410c', GS4:'#15803d' }

export default function CurrentAffairsPage() {
  const { t } = useLang()
  const [caLang, setCaLang] = useState<'en'|'hi'>('hi')
  const [paperFilter, setPaperFilter] = useState('all')

  const filtered = caItems.filter(i => paperFilter === 'all' || i.paper === paperFilter)

  return (
    <div className="px-[5%] py-10 bg-[#f7f8fa] min-h-screen">
      <div className="max-w-[1140px] mx-auto">
        <span className="text-xs font-semibold text-[#E8630A] uppercase tracking-widest mb-2 block">{t('Current Affairs', 'समसामयिकी')}</span>
        <h1 className="font-display text-3xl font-bold mb-1">{t('Daily digest. AI-tagged. MCQs included.', 'दैनिक सारांश। AI-tagged। MCQ सहित।')}</h1>
        <p className="text-sm text-[#64748b] mb-6">{t('Published daily at 7 AM. AI generates 3 practice MCQs per news item.', 'प्रतिदिन सुबह 7 बजे प्रकाशित। AI प्रत्येक समाचार पर 3 MCQ बनाता है।')}</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 p-2.5 bg-white border border-[#e8eaed] rounded-xl">
            <span className="text-xs font-semibold text-[#64748b] mr-1">{t('Language:','भाषा:')}</span>
            <button onClick={() => setCaLang('en')} className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${caLang==='en'?'bg-[#E8630A] text-white border-[#E8630A]':'border-[#e8eaed] text-[#64748b]'}`}>English</button>
            <button onClick={() => setCaLang('hi')} className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer font-hindi ${caLang==='hi'?'bg-[#E8630A] text-white border-[#E8630A]':'border-[#e8eaed] text-[#64748b]'}`}>हिंदी</button>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white border border-[#e8eaed] rounded-xl">
            <span className="text-xs font-semibold text-[#64748b] mr-1">{t('Paper:','पेपर:')}</span>
            {['all','GS1','GS2','GS3','GS4'].map(p => (
              <button key={p} onClick={() => setPaperFilter(p)} className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${paperFilter===p?'bg-[#E8630A] text-white border-[#E8630A]':'border-[#e8eaed] text-[#64748b]'}`}>
                {p === 'all' ? t('All','सभी') : p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map(item => (
            <div key={item.date+item.paper} className="bg-white border border-[#e8eaed] rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_5px_18px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-[#e8eaed] bg-[#f7f8fa]">
                <span className="text-[10px] text-[#94a3b8]">{item.date}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:paperColor[item.paper],color:paperText[item.paper]}}>{item.paper}</span>
              </div>
              <div className="p-3.5">
                <h3 className={`text-sm font-semibold leading-snug mb-2 ${caLang==='hi'?'font-hindi text-[15px]':''}`}>{caLang==='hi'?item.hi.h:item.en.h}</h3>
                <p className={`text-xs text-[#64748b] leading-relaxed line-clamp-3 ${caLang==='hi'?'font-hindi text-[13px]':''}`}>{caLang==='hi'?item.hi.p:item.en.p}</p>
              </div>
              <div className="flex justify-between items-center px-3.5 py-2.5 border-t border-[#e8eaed]">
                <span className="text-[11px] font-semibold text-[#1d4ed8] bg-[#eff6ff] px-2.5 py-1 rounded-full">🤖 {item.mcqs} {t('MCQs','MCQ')}</span>
                <span className="text-xs text-[#94a3b8]">{t('Read more →','और पढ़ें →')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
