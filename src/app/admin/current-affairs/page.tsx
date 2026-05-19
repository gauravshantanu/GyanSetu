'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false
function getSupabase() {
  if (!supabaseReady) return null
  try { const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs'); return createClientComponentClient() }
  catch { return null }
}

const blank = {
  date: new Date().toISOString().split('T')[0],
  headline_en: '', headline_hi: '', body_en: '', body_hi: '',
  gs_paper: 'GS2', source: '',
}
const gsPapers = ['GS1','GS2','GS3','GS4','Science & Tech','Environment','Economy','International']

export default function AdminCurrentAffairs() {
  const [supabase] = useState(() => getSupabase())
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [genMCQ, setGenMCQ] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase.from('currentaffairs').select('*').order('date', { ascending: false }).limit(30)
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [supabase])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !form.headline_en) return
    setSaving(true); setMsg('')

    let mcqs: any[] = []
    if (genMCQ && form.body_en) {
      try {
        const res = await fetch('/api/ai/doubt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: `Generate 3 UPSC MCQ questions based on this news in JSON array format [{question, options:[A,B,C,D], correct_option(0-3), explanation}]. News: ${form.headline_en}. ${form.body_en}. Return only JSON.`,
            lang: 'en',
          }),
        })
        const data = await res.json()
        const cleaned = data.answer?.replace(/```json|```/g, '').trim()
        mcqs = JSON.parse(cleaned)
      } catch {}
    }

    const { error } = await supabase.from('currentaffairs').insert({ ...form, mcqs })
    if (error) { setMsg(`Error: ${error.message}`); setSaving(false); return }
    setMsg('Current affair added!'); setForm(blank); setSaving(false); load()
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm('Delete?')) return
    await supabase.from('currentaffairs').delete().eq('id', id); load()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">Current Affairs</h1>
        <p className="text-sm text-[#64748b]">Post daily news digests in Hindi and English. AI auto-generates MCQs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
            <h2 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2"><Plus size={15} /> Add News Item</h2>
            {msg && <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{msg}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} />
                </Field>
                <Field label="GS Paper">
                  <select value={form.gs_paper} onChange={e => set('gs_paper', e.target.value)} className={inp}>
                    {gsPapers.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Headline (English) *">
                <input value={form.headline_en} onChange={e => set('headline_en', e.target.value)} required placeholder="India signs pact with…" className={inp} />
              </Field>
              <Field label="Headline (Hindi)">
                <input value={form.headline_hi} onChange={e => set('headline_hi', e.target.value)} placeholder="भारत ने समझौता किया…" className={inp} />
              </Field>

              <Field label="Body (English)">
                <textarea value={form.body_en} onChange={e => set('body_en', e.target.value)} rows={5} placeholder="Full news article in English…" className={`${inp} resize-none`} />
              </Field>
              <Field label="Body (Hindi)">
                <textarea value={form.body_hi} onChange={e => set('body_hi', e.target.value)} rows={5} placeholder="हिंदी में पूरी खबर…" className={`${inp} resize-none`} />
              </Field>

              <Field label="Source">
                <input value={form.source} onChange={e => set('source', e.target.value)} placeholder="The Hindu, PIB, etc." className={inp} />
              </Field>

              {/* AI MCQ toggle */}
              <button
                type="button"
                onClick={() => setGenMCQ(!genMCQ)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all bg-transparent ${genMCQ ? 'border-[#E8630A] text-[#E8630A] bg-[#fff5ef]' : 'border-[#e8eaed] text-[#64748b]'}`}
              >
                <Sparkles size={15} />
                {genMCQ ? 'AI MCQs ON — will generate 3 MCQs' : 'AI MCQs OFF — click to enable'}
              </button>

              <button type="submit" disabled={saving} className="w-full bg-[#E8630A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors disabled:opacity-60 border-none cursor-pointer flex items-center justify-center gap-2 mt-1">
                {saving ? <><Loader2 size={14} className="animate-spin" /> {genMCQ ? 'Generating MCQs & Saving…' : 'Saving…'}</> : 'Add Current Affair'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
            <div className="p-5 border-b border-[#e8eaed]">
              <h2 className="text-sm font-bold text-[#0f172a]">Recent Items ({items.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#94a3b8]">Loading…</div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center"><div className="text-3xl mb-2">📰</div><p className="text-sm text-[#64748b]">No items yet.</p></div>
            ) : (
              <div className="divide-y divide-[#e8eaed]">
                {items.map(item => (
                  <div key={item.id} className="p-4 hover:bg-[#f7f8fa] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1.5 mb-1.5">
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">{item.date}</span>
                          <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{item.gs_paper}</span>
                          {item.mcqs?.length > 0 && (
                            <span className="text-[10px] bg-[#fff5ef] text-[#E8630A] px-1.5 py-0.5 rounded-full">{item.mcqs.length} MCQs</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-[#0f172a] line-clamp-2">{item.headline_en}</p>
                        {item.headline_hi && <p className="text-xs text-[#64748b] mt-0.5 line-clamp-1">{item.headline_hi}</p>}
                        {item.source && <p className="text-[10px] text-[#94a3b8] mt-1">Source: {item.source}</p>}
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer flex-shrink-0">
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
