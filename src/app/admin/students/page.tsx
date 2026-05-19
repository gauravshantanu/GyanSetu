'use client'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false
function getSupabase() {
  if (!supabaseReady) return null
  try { const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs'); return createClientComponentClient() }
  catch { return null }
}

export default function AdminStudents() {
  const [supabase] = useState(() => getSupabase())
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('students').select('*').order('created_at', { ascending: false })
      .then(({ data }: any) => { setStudents(data || []); setLoading(false) })
  }, [supabase])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">Students</h1>
        <p className="text-sm text-[#64748b]">All registered students on GyanSetu.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
        <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0f172a]">All Students ({students.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#94a3b8]">Loading…</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="text-[#94a3b8] mx-auto mb-3" />
            <p className="text-sm text-[#64748b]">No students yet. Share GyanSetu to get signups!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f7f8fa] border-b border-[#e8eaed]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Exam</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Year</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Lang</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Streak</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eaed]">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-[#f7f8fa] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#E8630A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {s.name?.[0]?.toUpperCase() || s.email?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0f172a]">{s.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#64748b]">{s.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.exam_goal === 'UPSC' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {s.exam_goal || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#64748b]">{s.exam_year || '—'}</td>
                    <td className="px-5 py-3 text-[#64748b] uppercase text-xs font-medium">{s.preferred_lang || 'en'}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-[#E8630A] font-semibold text-xs">
                        🔥 {s.streak || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#64748b] text-xs">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
