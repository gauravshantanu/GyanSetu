'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false
function getSupabase() {
  if (!supabaseReady) return null
  try { const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs'); return createClientComponentClient() }
  catch { return null }
}

const blank = {
  question_en: '', question_hi: '',
  options_en: ['', '', '', ''], options_hi: ['', '', '', ''],
  correct_option: 0, explanation_en: '', explanation_hi: '',
  year: 2024, paper: 'Prelims GS1', subject_en: '', subject_hi: '', tags: '',
}

const papers = ['Prelims GS1','Prelims CSAT','Mains GS1','Mains GS2','Mains GS3','Mains GS4','Essay','NEET']
const years = Array.from({ length: 12 }, (_, i) => 2024 - i)

export default function AdminPYQ() {
  const [supabase] = useState(() => getSupabase())
  const [questions, setQuestions] = useState<any[]>([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase.from('pyquestions').select('*').order('created_at', { ascending: false }).limit(50)
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [supabase])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }
  function setOption(lang: 'en' | 'hi', i: number, v: string) {
    setForm(f => {
      const arr = [...f[`options_${lang}` as keyof typeof f] as string[]]
      arr[i] = v
      return { ...f, [`options_${lang}`]: arr }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true); setMsg('')
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }
    const { error } = await supabase.from('pyquestions').insert(payload)
    if (error) { setMsg(`Error: ${error.message}`); setSaving(false); return }
    setMsg('Question added!'); setForm(blank); setSaving(false); load()
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm('Delete this question?')) return
    await supabase.from('pyquestions').delete().eq('id', id); load()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">PYQ Questions</h1>
        <p className="text-sm text-[#64748b]">Add previous year questions in Hindi and English with options and explanations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
            <h2 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2"><Plus size={15} /> Add Question</h2>
            {msg && <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{msg}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Year">
                  <select value={form.year} onChange={e => set('year', Number(e.target.value))} className={inp}>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </Field>
                <Field label="Paper">
                  <select value={form.paper} onChange={e => set('paper', e.target.value)} className={inp}>
                    {papers.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Subject (EN)"><input value={form.subject_en} onChange={e => set('subject_en', e.target.value)} placeholder="Polity" className={inp} /></Field>
                <Field label="Subject (HI)"><input value={form.subject_hi} onChange={e => set('subject_hi', e.target.value)} placeholder="राजव्यवस्था" className={inp} /></Field>
              </div>

              <Field label="Question (English) *">
                <textarea value={form.question_en} onChange={e => set('question_en', e.target.value)} required rows={3} placeholder="Which of the following…" className={`${inp} resize-none`} />
              </Field>
              <Field label="Question (Hindi)">
                <textarea value={form.question_hi} onChange={e => set('question_hi', e.target.value)} rows={3} placeholder="निम्नलिखित में से कौन…" className={`${inp} resize-none`} />
              </Field>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2">Options (A–D)</label>
                <div className="flex flex-col gap-2">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => set('correct_option', i)}
                        className={`w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 border-2 cursor-pointer transition-all ${form.correct_option === i ? 'bg-[#128807] border-[#128807] text-white' : 'bg-white border-[#e8eaed] text-[#64748b]'}`}
                      >
                        {String.fromCharCode(65+i)}
                      </button>
                      <input value={form.options_en[i]} onChange={e => setOption('en', i, e.target.value)} placeholder={`Option ${String.fromCharCode(65+i)} (English)`} className={`${inp} flex-1`} />
                    </div>
                  ))}
                  <p className="text-[10px] text-[#94a3b8]">Click A/B/C/D circle to mark correct answer (green)</p>
                </div>
              </div>

              <Field label="Hindi Options (optional)">
                <div className="flex flex-col gap-2">
                  {[0,1,2,3].map(i => (
                    <input key={i} value={form.options_hi[i]} onChange={e => setOption('hi', i, e.target.value)} placeholder={`विकल्प ${String.fromCharCode(65+i)}`} className={inp} />
                  ))}
                </div>
              </Field>

              <Field label="Explanation (English)">
                <textarea value={form.explanation_en} onChange={e => set('explanation_en', e.target.value)} rows={2} placeholder="The correct answer is…" className={`${inp} resize-none`} />
              </Field>
              <Field label="Explanation (Hindi)">
                <textarea value={form.explanation_hi} onChange={e => set('explanation_hi', e.target.value)} rows={2} placeholder="सही उत्तर है…" className={`${inp} resize-none`} />
              </Field>

              <Field label="Tags (comma-separated)">
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="polity, fundamental rights, article 21" className={inp} />
              </Field>

              <button type="submit" disabled={saving} className="w-full bg-[#E8630A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors disabled:opacity-60 border-none cursor-pointer flex items-center justify-center gap-2 mt-1">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Add Question'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
            <div className="p-5 border-b border-[#e8eaed]">
              <h2 className="text-sm font-bold text-[#0f172a]">Questions ({questions.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#94a3b8]">Loading…</div>
            ) : questions.length === 0 ? (
              <div className="p-8 text-center"><div className="text-3xl mb-2">📄</div><p className="text-sm text-[#64748b]">No questions yet.</p></div>
            ) : (
              <div className="divide-y divide-[#e8eaed]">
                {questions.map((q, i) => (
                  <div key={q.id} className="p-4 hover:bg-[#f7f8fa] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1.5 mb-1.5">
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">{q.year}</span>
                          <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{q.paper}</span>
                          {q.subject_en && <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{q.subject_en}</span>}
                        </div>
                        <p className="text-sm text-[#0f172a] line-clamp-2">{q.question_en}</p>
                        <div className="flex gap-2 mt-1.5">
                          {q.options_en?.map((opt: string, j: number) => (
                            <span key={j} className={`text-[10px] px-1.5 py-0.5 rounded-full ${j === q.correct_option ? 'bg-green-100 text-green-700 font-semibold' : 'bg-[#f0f2f5] text-[#64748b]'}`}>
                              {String.fromCharCode(65+j)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 rounded-xl border border-[#e8eaed] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#E8630A] focus:ring-2 focus:ring-[#E8630A]/10 transition-all'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>{children}</div>
}
