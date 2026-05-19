import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Types ──────────────────────────────────────────
export type Student = {
  id: string
  email: string
  name: string
  exam_goal: 'UPSC' | 'NEET'
  exam_year: number
  preferred_lang: 'en' | 'hi'
  streak: number
  created_at: string
}

export type Video = {
  id: string
  title_en: string
  title_hi: string
  youtube_id: string
  subject_en: string
  subject_hi: string
  chapter_en: string
  chapter_hi: string
  gs_paper: string
  duration_min: number
  language: 'hi' | 'en' | 'bi'
  thumbnail: string
}

export type PYQuestion = {
  id: string
  question_en: string
  question_hi: string
  options_en: string[]
  options_hi: string[]
  correct_option: number
  explanation_en: string
  explanation_hi: string
  year: number
  paper: string
  subject_en: string
  subject_hi: string
  tags: string[]
}

export type CurrentAffair = {
  id: string
  date: string
  headline_en: string
  headline_hi: string
  body_en: string
  body_hi: string
  gs_paper: string
  mcqs: any[]
  source: string
}

export type MockTest = {
  id: string
  title_en: string
  title_hi: string
  paper: string
  total_questions: number
  duration_min: number
  negative_marking: number
  questions: string[]
}
