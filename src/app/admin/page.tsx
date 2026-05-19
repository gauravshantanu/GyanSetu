'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Video, FileText, Newspaper, Users, Plus, ArrowRight } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false
function getSupabase() {
  if (!supabaseReady) return null
  try { const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs'); return createClientComponentClient() }
  catch { return null }
}

const sections = [
  { href: '/admin/videos',           icon: Video,      label: 'Videos',          color: 'text-blue-600',   bg: 'bg-blue-50',   table: 'videos' },
  { href: '/admin/pyq',              icon: FileText,   label: 'PYQ Questions',   color: 'text-purple-600', bg: 'bg-purple-50', table: 'pyquestions' },
  { href: '/admin/current-affairs',  icon: Newspaper,  label: 'Current Affairs', color: 'text-yellow-600', bg: 'bg-yellow-50', table: 'currentaffairs' },
  { href: '/admin/students',         icon: Users,      label: 'Students',        color: 'text-green-600',  bg: 'bg-green-50',  table: 'students' },
]

export default function AdminOverview() {
  const [supabase] = useState(() => getSupabase())
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!supabase) return
    sections.forEach(async ({ table }) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
      setCounts(prev => ({ ...prev, [table]: count || 0 }))
    })
  }, [supabase])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Admin Overview</h1>
        <p className="text-sm text-[#64748b]">Manage all GyanSetu content from here.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sections.map(({ href, icon: Icon, label, color, bg, table }) => (
          <Link key={href} href={href} className="no-underline">
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-5 hover:border-[#E8630A]/40 hover:shadow-sm transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <div className="text-2xl font-bold text-[#0f172a] mb-0.5">
                {counts[table] ?? '—'}
              </div>
              <div className="text-sm text-[#64748b]">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-6">
        <h2 className="text-sm font-bold text-[#0f172a] mb-4">Quick Actions</h2>
        <div className="flex flex-col gap-2">
          {sections.slice(0,3).map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f7f8fa] transition-colors no-underline group">
              <Icon size={16} className={color} />
              <span className="text-sm font-medium text-[#0f172a]">Add new {label.slice(0,-1)}</span>
              <ArrowRight size={14} className="text-[#94a3b8] ml-auto group-hover:text-[#E8630A] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* SQL setup notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-amber-800 mb-2">⚠️ Supabase Tables Required</h3>
        <p className="text-xs text-amber-700 mb-3">Run this SQL in your Supabase SQL Editor to create the required tables:</p>
        <Link
          href="https://supabase.com/dashboard/project/zsyfpvvzcojidpfcwebb/sql/new"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg no-underline hover:bg-amber-200 transition-colors"
        >
          Open SQL Editor <ArrowRight size={12} />
        </Link>
        <pre className="mt-3 text-xs text-amber-800 bg-amber-100 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{`-- Students
create table if not exists students (
  id uuid primary key references auth.users(id),
  email text, name text, exam_goal text, exam_year int,
  preferred_lang text default 'en', streak int default 0,
  created_at timestamptz default now()
);

-- Videos
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title_en text, title_hi text, youtube_id text,
  subject_en text, subject_hi text, chapter_en text, chapter_hi text,
  gs_paper text, duration_min int, language text default 'bi',
  thumbnail text, created_at timestamptz default now()
);

-- PYQ Questions
create table if not exists pyquestions (
  id uuid primary key default gen_random_uuid(),
  question_en text, question_hi text,
  options_en text[], options_hi text[],
  correct_option int, explanation_en text, explanation_hi text,
  year int, paper text, subject_en text, subject_hi text,
  tags text[], created_at timestamptz default now()
);

-- Current Affairs
create table if not exists currentaffairs (
  id uuid primary key default gen_random_uuid(),
  date date, headline_en text, headline_hi text,
  body_en text, body_hi text, gs_paper text,
  mcqs jsonb default '[]', source text,
  created_at timestamptz default now()
);

-- Enable RLS and allow admin reads/writes
alter table students enable row level security;
alter table videos enable row level security;
alter table pyquestions enable row level security;
alter table currentaffairs enable row level security;

create policy "Public read videos" on videos for select using (true);
create policy "Public read pyq" on pyquestions for select using (true);
create policy "Public read ca" on currentaffairs for select using (true);
create policy "Auth users read students" on students for select using (auth.uid() = id);
create policy "Auth users upsert students" on students for insert with check (auth.uid() = id);
create policy "Auth users update students" on students for update using (auth.uid() = id);`}</pre>
      </div>
    </div>
  )
}
