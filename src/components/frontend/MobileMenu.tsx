'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import NavLinks from './NavLinks'

import { createBrowserClient } from '@supabase/ssr'
import { logout } from '@/app/actions/auth'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="flex items-center relative z-[120]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary hover:text-accent p-2 transition-colors focus:outline-none relative z-[130]" 
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-md z-[120] transform transition-transform duration-500 ease-in-out flex flex-col pt-32 px-8 pb-32 overflow-y-auto h-screen w-full ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: 0, left: 0 }}
      >
        <nav className="flex flex-col space-y-6">

          <NavLinks user={user} isMobile={true} setIsOpen={setIsOpen} logoutAction={logout} />
        </nav>
      </div>
    </div>
  )
}
