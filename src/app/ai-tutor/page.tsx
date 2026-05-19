'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import { Send } from 'lucide-react'

type Message = { role: 'user' | 'ai'; text: string; isHindi?: boolean }

export default function AiTutorPage() {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Namaste! 🙏 Main aapka GyanSetu AI tutor hoon. Hindi ya English — dono mein sawaal puchh sakte hain. Koi bhi UPSC ya NEET doubt ho, seedha puchhiye!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    const isHindi = /[\u0900-\u097F]/.test(msg) || lang === 'hi'
    setMessages(prev => [...prev, { role: 'user', text: msg, isHindi }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: msg, lang: isHindi ? 'hi' : 'en' }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer, isHindi }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: t('Sorry, something went wrong. Please try again.', 'क्षमा करें, कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-[5%] py-12 min-h-screen bg-[#f7f8fa]">
      <div className="max-w-[800px] mx-auto">
        <span className="text-xs font-semibold text-[#E8630A] uppercase tracking-widest mb-2 block">AI {t('Tutor', 'शिक्षक')}</span>
        <h1 className="font-display text-3xl font-bold mb-1">{t('Ask your UPSC doubt', 'अपनी UPSC शंका पूछें')}</h1>
        <p className="text-sm text-[#64748b] mb-6">{t('Hindi or English — get instant answers 24/7', 'हिंदी या अंग्रेज़ी — 24/7 तुरंत उत्तर पाएँ')}</p>

        {/* Chat window */}
        <div className="bg-white border border-[#e8eaed] rounded-[18px] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-[#E8630A] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🎓</div>
            <div>
              <div className="text-sm font-semibold text-white">GyanSetu AI</div>
              <div className="text-[11px] text-white/75 font-hindi">हिंदी / English — दोनों में उत्तर देता हूँ</div>
            </div>
            <div className="ml-auto text-[11px] text-white/75 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" /> {t('Online', 'ऑनलाइन')}</div>
          </div>

          {/* Messages */}
          <div className="p-4 flex flex-col gap-3 min-h-[400px] max-h-[500px] overflow-y-auto bg-[#f7f8fa]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${m.role === 'ai' ? 'bg-[#fff4ee]' : 'bg-[#eff6ff]'}`}>
                  {m.role === 'ai' ? '🎓' : '👤'}
                </div>
                <div className={`max-w-[80%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${m.role === 'ai' ? 'bg-white border border-[#e8eaed] rounded-tl-sm' : 'bg-[#E8630A] text-white rounded-tr-sm'} ${m.isHindi ? 'font-hindi text-[15px]' : ''}`}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#fff4ee] flex items-center justify-center text-xs">🎓</div>
                <div className="bg-white border border-[#e8eaed] rounded-xl rounded-tl-sm px-4 py-3 text-sm text-[#94a3b8]">
                  {t('Thinking...', 'सोच रहा हूँ...')}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#e8eaed] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t('Type your UPSC doubt in Hindi or English...', 'हिंदी या अंग्रेज़ी में UPSC शंका टाइप करें...')}
              className="flex-1 border border-[#e8eaed] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E8630A] bg-[#f7f8fa] font-hindi"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-[#E8630A] text-white border-none w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#c4520a] disabled:opacity-50 transition-colors shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="mt-4">
          <p className="text-xs text-[#94a3b8] mb-2">{t('Quick questions:', 'तुरंत पूछें:')}</p>
          <div className="flex gap-2 flex-wrap">
            {[
              [t('What is the 73rd Amendment?', '73वाँ संशोधन क्या है?')],
              [t('Explain Directive Principles', 'नीति निदेशक तत्व समझाएँ')],
              [t('UPSC syllabus for GS1', 'GS1 का UPSC पाठ्यक्रम')],
              [t('Current account deficit', 'चालू खाता घाटा')],
            ].map(([q]) => (
              <button key={q} onClick={() => { setInput(q); }} className="text-xs px-3 py-1.5 bg-white border border-[#e8eaed] rounded-full text-[#64748b] cursor-pointer hover:border-[#E8630A] hover:text-[#E8630A] transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
