// Gemini AI helper — uses Google's free tier
// Get your free API key at: https://aistudio.google.com

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function askGemini(prompt: string, lang: 'en' | 'hi' = 'en'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in .env.local')

  const systemPrompt = lang === 'hi'
    ? `आप GyanSetu के UPSC और NEET AI शिक्षक हैं। हिंदी में स्पष्ट और सरल भाषा में उत्तर दें। UPSC परीक्षा के संदर्भ में उत्तर दें। पिछले वर्षों के प्रश्नों का संदर्भ दें।`
    : `You are GyanSetu's UPSC and NEET AI tutor. Give clear, concise answers in the context of UPSC/NEET exam preparation. Reference previous year questions when relevant. Keep answers structured and exam-focused.`

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: lang === 'hi' ? 'बिल्कुल! मैं आपकी मदद करूँगा।' : 'Understood! I will help you with UPSC/NEET preparation.' }] },
        { role: 'user', parts: [{ text: prompt }] },
      ],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    }),
  })

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, could not get a response.'
}

export async function generateMCQs(topic: string, lang: 'en' | 'hi' = 'en', count = 5): Promise<any[]> {
  const prompt = lang === 'hi'
    ? `"${topic}" विषय पर ${count} UPSC-स्तरीय MCQ प्रश्न बनाएँ। JSON array में दें: [{question, options:[A,B,C,D], correct_option(0-3), explanation}]। केवल JSON दें, कुछ और नहीं।`
    : `Generate ${count} UPSC-level MCQ questions on "${topic}". Return as JSON array: [{question, options:[A,B,C,D], correct_option(0-3), explanation}]. Return only JSON, nothing else.`

  const raw = await askGemini(prompt, lang)
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

export async function evaluateAnswer(question: string, answer: string, lang: 'en' | 'hi' = 'en'): Promise<{score: number, feedback: string}> {
  const prompt = lang === 'hi'
    ? `UPSC मेन्स उत्तर का मूल्यांकन करें:\nप्रश्न: ${question}\nउत्तर: ${answer}\n250 में से अंक दें और JSON में दें: {score: number, feedback: string}। केवल JSON।`
    : `Evaluate this UPSC Mains answer:\nQuestion: ${question}\nAnswer: ${answer}\nScore out of 250 and return JSON: {score: number, feedback: string}. Only JSON.`

  const raw = await askGemini(prompt, lang)
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { score: 0, feedback: raw }
  }
}
