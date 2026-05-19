'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Video, FileText, Newspaper, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react'

const supabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ?? false

function getSupabase() {
  if (!supabaseReady) return null
  try {
    const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
    return createClientComponentClient()
  } catch { return null }
}

const navItems = [
  { href: '/admin',                  icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/videos',           icon: Video,           label: 'Videos' },
  { href: '/admin/pyq',              icon: FileText,        label: 'PYQ Questions' },
  { href: '/admin/current-affairs',  icon: Newspaper,       label: 'Current Affairs' },
  { href: '/admin/students',         icon: Users,           label: 'Students' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [supabase] = useState(() => getSupabase())
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }: any) => {
      const u = data.session?.user
      if (!u) { router.replace('/login'); return }
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (adminEmail && u.email !== adminEmail) { router.replace('/'); return }
      setUser(u)
      setLoading(false)
    })
  }, [supabase, router])

  async function handleLogout() {
    await supabase?.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 rounded-full border-4 border-[#E8630A] border-t-transparent animate-spin" />
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E8630A] flex items-center justify-center text-sm">🌉</div>
          <div>
            <div className="text-white font-bold text-sm">GyanSetu</div>
            <div className="text-white/40 text-[10px]">Admin CMS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${
                active
                  ? 'bg-[#E8630A] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#E8630A] flex items-center justify-center text-white text-xs font-bold">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.email}</div>
            <div className="text-white/40 text-[10px]">Administrator</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 bg-transparent border-none cursor-pointer transition-all"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-[#0f172a] flex-col fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-56 bg-[#0f172a] flex flex-col h-full">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e8eaed] h-14 flex items-center justify-between px-5 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden bg-transparent border-none cursor-pointer text-[#64748b]"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#64748b]">GyanSetu Admin</span>
            <span className="text-[#e8eaed]">·</span>
            <Link href="/" className="text-xs text-[#E8630A] hover:underline no-underline font-medium">
              ← View site
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E8630A] flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
