'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'en' | 'hi'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, hi: string) => string
  isHindi: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
  isHindi: false,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('hindi', l === 'hi')
    }
  }

  const t = (en: string, hi: string) => (lang === 'hi' ? hi : en)

  return (
    <LangContext.Provider value={{ lang, setLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
