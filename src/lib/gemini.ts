// AI helper — uses Groq (free tier, no billing needed)
// Get your free API key at: https://console.groq.com

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set in .env.local')

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices?.[0]?.message?.content || 'Sorry, could not get a response.'
}

export async function askGemini(prompt: string, lang: 'en' | 'hi' = 'en'): Promise<string> {
  const systemPrompt = lang === 'hi'
    ? `आप GyanSetu के UPSC और NEET AI शिक्षक हैं। हिंदी में स्पष्ट और सरल भाषा में उत्तर दें। UPSC परीक्षा के संदर्भ में उत्तर दें।`
    : `You are GyanSetu's UPSC and NEET AI tutor. Give clear, concise answers for exam preparation. Keep answers structured and exam-focused.`
  return callGroq(systemPrompt, prompt)
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
