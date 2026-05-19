import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, lang } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        answer: lang === 'hi'
          ? `यह एक demo उत्तर है। असली AI उत्तर के लिए .env.local में GROQ_API_KEY जोड़ें।\n\n**प्रश्न:** ${question}\n\n**उत्तर:** यह विषय UPSC परीक्षा में महत्वपूर्ण है।`
          : `This is a demo answer. Add GROQ_API_KEY in .env.local for real AI responses.\n\n**Question:** ${question}\n\n**Answer:** This is an important topic for UPSC.`
      })
    }

    const systemPrompt = lang === 'hi'
      ? `आप GyanSetu के UPSC और NEET AI शिक्षक हैं। हिंदी में स्पष्ट और सरल भाषा में उत्तर दें। UPSC परीक्षा के संदर्भ में उत्तर दें। महत्वपूर्ण शब्दों को **bold** करें।`
      : `You are GyanSetu's UPSC and NEET AI tutor. Give clear, structured answers for Indian competitive exam preparation (UPSC/NEET). Reference previous year questions when relevant. Use **bold** for key terms. Keep answers concise and exam-focused.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    const data = await res.json()

    if (data.error) {
      console.error('Groq API error:', data.error)
      return NextResponse.json(
        { answer: `AI Error: ${data.error.message || 'Unknown error from Groq.'}` },
        { status: 500 }
      )
    }

    const answer = data.choices?.[0]?.message?.content
    if (!answer) {
      console.error('Unexpected Groq response:', JSON.stringify(data))
      return NextResponse.json({ answer: 'No response from AI. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ answer })
  } catch (err) {
    console.error('Doubt API error:', err)
    return NextResponse.json({ answer: 'Error connecting to AI. Please try again.' }, { status: 500 })
  }
}
