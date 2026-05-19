'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false
function getSupabase() {
  if (!supabaseReady) return null
  try { const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs'); return createClientComponentClient() }
  catch { return null }
}

const blank = {
  youtube_id: '', title_en: '', title_hi: '', subject_en: '', subject_hi: '',
  chapter_en: '', chapter_hi: '', gs_paper: 'GS1', duration_min: 30, language: 'bi',
}

const gsPapers = ['GS1','GS2','GS3','GS4','CSAT','Essay','NEET-Bio','NEET-Chem','NEET-Phy']

export default function AdminVideos() {
  const [supabase] = useState(() => getSupabase())
  const [videos, setVideos] = useState<any[]>([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    setVideos(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [supabase])

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !form.youtube_id || !form.title_en) return
    setSaving(true)
    setMsg('')
    const thumbnail = `https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`
    const { error } = await supabase.from('videos').insert({ ...form, thumbnail })
    if (error) { setMsg(`Error: ${error.message}`); setSaving(false); return }
    setMsg('Video added successfully!')
    setForm(blank)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!supabase || !confirm('Delete this video?')) return
    await supabase.from('videos').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">Video Lectures</h1>
        <p className="text-sm text-[#64748b]">Add YouTube videos — students watch them on GyanSetu without redirects.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
            <h2 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2"><Plus size={15} /> Add New Video</h2>
            {msg && <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${msg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{msg}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <Field label="YouTube Video ID *" hint="e.g. dQw4w9WgXcQ">
                <input value={form.youtube_id} onChange={e => set('youtube_id', e.target.value)} required placeholder="dQw4w9WgXcQ" className={inp} />
              </Field>

              {form.youtube_id && (
                <img src={`https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`} className="rounded-xl w-full object-cover" alt="preview" />
              )}

              <Field label="Title (English) *">
                <input value={form.title_en} onChange={e => set('title_en', e.target.value)} required placeholder="Indian Constitution — Preamble" className={inp} />
              </Field>
              <Field label="Title (Hindi)">
                <input value={form.title_hi} onChange={e => set('title_hi', e.target.value)} placeholder="भारतीय संविधान — प्रस्तावना" className={inp} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Subject (EN)">
                  <input value={form.subject_en} onChange={e => set('subject_en', e.target.value)} placeholder="Polity" className={inp} />
                </Field>
                <Field label="Subject (HI)">
                  <input value={form.subject_hi} onChange={e => set('subject_hi', e.target.value)} placeholder="राजव्यवस्था" className={inp} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Chapter (EN)">
                  <input value={form.chapter_en} onChange={e => set('chapter_en', e.target.value)} placeholder="Fundamental Rights" className={inp} />
                </Field>
                <Field label="Chapter (HI)">
                  <input value={form.chapter_hi} onChange={e => set('chapter_hi', e.target.value)} placeholder="मूल अधिकार" className={inp} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="GS Paper">
                  <select value={form.gs_paper} onChange={e => set('gs_paper', e.target.value)} className={inp}>
                    {gsPapers.map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Duration (min)">
                  <input type="number" value={form.duration_min} onChange={e => set('duration_min', Number(e.target.value))} className={inp} min={1} />
                </Field>
              </div>
              <Field label="Language">
                <select value={form.language} onChange={e => set('language', e.target.value)} className={inp}>
                  <option value="hi">Hindi</option>
                  <option value="en">English</option>
                  <option value="bi">Bilingual</option>
                </select>
              </Field>

              <button type="submit" disabled={saving} className="w-full bg-[#E8630A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#c4520a] transition-colors disabled:opacity-60 border-none cursor-pointer flex items-center justify-center gap-2 mt-1">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Add Video'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
            <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0f172a]">All Videos ({videos.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#94a3b8]">Loading…</div>
            ) : videos.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2">📺</div>
                <p className="text-sm text-[#64748b]">No videos yet. Add your first video.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e8eaed]">
                {videos.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-4 hover:bg-[#f7f8fa] transition-colors">
                    <img src={v.thumbnail} alt="" className="w-20 h-12 rounded-lg object-cover flex-shrink-0 bg-[#f0f2f5]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] truncate">{v.title_en}</p>
                      <p className="text-xs text-[#64748b] truncate">{v.title_hi}</p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{v.gs_paper}</span>
                        <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{v.language}</span>
                        <span className="text-[10px] bg-[#f0f2f5] text-[#64748b] px-1.5 py-0.5 rounded-full">{v.duration_min}m</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" className="p-1.5 rounded-lg text-[#64748b] hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer">
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
      {hint && <p className="text-[10px] text-[#94a3b8] mb-1">{hint}</p>}
      {children}
    </div>
  )
}
