'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { LayoutDashboard, Database, Users, UserCircle, Newspaper, Settings, LogOut, Home, Menu, X, Camera, ClipboardList, FileText, Calendar, Globe, MessageSquare, Zap } from 'lucide-react'

import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { getCurrentUserPermissions } from '@/app/actions/permissions'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    async function loadPermissions() {
      try {
        const data = await getCurrentUserPermissions()
        setUserRole(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadPermissions()
  }, [])

  const allNavItems = [
    { id: 'overview', href: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { id: 'properties', href: '/admin/properties', icon: Database, label: 'Properties' },
    { id: 'pages', href: '/admin/pages/investors', icon: Globe, label: 'Website Content' },
    { id: 'pages', href: '/admin/pages/about', icon: Globe, label: 'Edit About Text' },
    { id: 'appointments', href: '/admin/appointments', icon: Calendar, label: 'Visits (New)' },
    { id: 'references', href: '/admin/references', icon: Camera, label: 'References' },
    { id: 'inventory', href: '/admin/inventory', icon: ClipboardList, label: 'Inventory' },
    { id: 'quotes', href: '/admin/quotes', icon: FileText, label: 'Quotes & Orders' },
    { id: 'crm', href: '/admin/crm', icon: Users, label: 'Customers (CRM)' },
    { id: 'linkedin', href: '/admin/linkedin', icon: MessageSquare, label: 'LinkedIn Outreach' },
    { id: 'magic', href: '/admin/magic-links', icon: Zap, label: 'Magic Links' },
    { id: 'staff', href: '/admin/staff', icon: Users, label: 'Staff & Time' },
    { id: 'team', href: '/admin/team', icon: UserCircle, label: 'Team' },
    { id: 'news', href: '/admin/news', icon: Newspaper, label: 'News' },
    { id: 'settings', href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  // Filter items based on permissions
  const navItems = allNavItems.filter(item => {
    // Overview and LinkedIn are always visible if they have CMS access
    if (item.id === 'overview' || item.id === 'linkedin' || item.id === 'magic') return true
    
    // Superadmin sees everything
    if (userRole?.role === 'superadmin') return true
    
    // Staff sees only what they have permission for
    if (userRole?.permissions?.[item.id]) return true
    
    return false
  })

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Equivest Logo" width={32} height={32} className="w-8 h-8 object-contain animate-[spin_20s_linear_infinite]" />
          <span className="text-lg font-serif font-semibold text-primary dark:text-white">CMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" title="Go to Website" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white flex items-center gap-1 text-sm font-bold">
            <Globe size={20} />
            <span className="hidden xs:inline">Website</span>
          </Link>
          <LanguageSwitcher expandDirection="left" />
          <button onClick={() => setIsOpen(true)} className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 shadow-lg md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 md:hidden">
            <Image src="/logo.png" alt="Equivest Logo" width={32} height={32} className="w-8 h-8 object-contain animate-[spin_20s_linear_infinite]" />
            <span className="text-xl font-serif font-semibold text-primary dark:text-white">CMS Menu</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Image src="/logo.png" alt="Equivest Logo" width={40} height={40} className="w-10 h-10 object-contain animate-[spin_20s_linear_infinite]" />
            <span className="text-xl font-serif font-semibold text-primary dark:text-white">Equivest CMS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block"><LanguageSwitcher expandDirection="left" /></div>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-primary p-2">
              <X size={28} />
            </button>
          </div>
        </div>
        
        {/* MOBILE APP-STYLE GRID MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:hidden pb-32">
          {/* Top Button on Mobile */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-6 p-4 w-full rounded-2xl bg-primary text-white font-bold shadow-md transition-colors active:scale-95">
            <Globe size={20} />
            Go to Website
          </Link>

          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">Menu</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? 'bg-primary border-primary shadow-lg text-white' 
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary/50 text-gray-600 dark:text-gray-300 shadow-sm'
                  }`}
                >
                  <item.icon className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-primary'}`} />
                  <span className="text-sm font-bold text-center leading-tight">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6 space-y-3">
             <Link href="/" className="flex items-center justify-center gap-2 p-4 w-full rounded-2xl bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 transition-colors active:bg-gray-100">
               <Globe size={20} />
               Go to Website
             </Link>
             <form action={logout}>
               <button type="submit" className="flex items-center justify-center gap-2 p-4 w-full rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold border border-red-100 dark:border-red-800/30 transition-colors active:bg-red-100">
                 <LogOut size={20} />
                 Logout
               </button>
             </form>
          </div>
        </div>

        {/* DESKTOP SIDEBAR MENU (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col flex-1 overflow-y-auto">
          <div className="px-4 pt-6 pb-2">
            <Link href="/" className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold shadow-md transition-all active:scale-95">
              <Globe size={20} />
              Return to Website
            </Link>
          </div>
          <div className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link href="/" className="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 rounded-xl font-medium transition-colors">
              <Globe size={20} />
              Go to Website
            </Link>
            <form action={logout}>
              <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors">
                <LogOut size={20} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
