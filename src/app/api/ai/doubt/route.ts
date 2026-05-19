import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, lang } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      // Demo mode — return a sample answer if no API key
      return NextResponse.json({
        answer: lang === 'hi'
          ? `यह एक demo उत्तर है। असली AI उत्तर के लिए .env.local में GEMINI_API_KEY जोड़ें।\n\n**प्रश्न:** ${question}\n\n**उत्तर:** यह विषय UPSC परीक्षा में महत्वपूर्ण है। संवैधानिक प्रावधानों और सर्वोच्च न्यायालय के निर्णयों के संदर्भ में इसका अध्ययन करें।`
          : `This is a demo answer. Add GEMINI_API_KEY in .env.local for real AI responses.\n\n**Question:** ${question}\n\n**Answer:** This is an important topic for UPSC. Study it in context of constitutional provisions and Supreme Court judgments.`
      })
    }

    const systemPrompt = lang === 'hi'
      ? `आप GyanSetu के UPSC और NEET AI शिक्षक हैं। हिंदी में स्पष्ट और सरल भाषा में उत्तर दें। UPSC परीक्षा के संदर्भ में उत्तर दें। महत्वपूर्ण शब्दों को **bold** करें।`
      : `You are GyanSetu's UPSC and NEET AI tutor. Give clear, structured answers for exam preparation. Reference PYQs when relevant. Use **bold** for key terms.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: lang === 'hi' ? 'समझ गया! मैं UPSC/NEET के संदर्भ में उत्तर दूँगा।' : 'Understood! I will answer in UPSC/NEET context.' }] },
            { role: 'user', parts: [{ text: question }] },
          ],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    )

    const data = await res.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not get response.'
    return NextResponse.json({ answer })
  } catch (err) {
    return NextResponse.json({ answer: 'Error connecting to AI. Please try again.' }, { status: 500 })
  }
}
