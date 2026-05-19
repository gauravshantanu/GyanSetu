import type { Metadata } from 'next'
import '../styles/globals.css'
import { LangProvider } from '@/lib/lang-context'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'GyanSetu — ज्ञान सेतु | Free UPSC & NEET Preparation',
  description: 'India\'s free UPSC and NEET preparation platform. Video lectures, 10-year PYQ bank, AI tutor, mock tests — in Hindi and English.',
  keywords: 'UPSC, NEET, free preparation, Hindi, IAS, Civil Services, GyanSetu',
  openGraph: {
    title: 'GyanSetu — Free UPSC & NEET Preparation',
    description: 'Hindi & English. Video lectures, PYQ bank, AI tutor, mock tests. 100% free.',
    url: 'https://gyansetu.in',
    siteName: 'GyanSetu',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <LangProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}
