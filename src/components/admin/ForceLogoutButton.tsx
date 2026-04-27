'use client'

import { createBrowserClient } from '@supabase/ssr'
import { LogOut } from 'lucide-react'

export default function ForceLogoutButton() {
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    await supabase.auth.signOut()
    
    // Hard reload to login screen
    window.location.href = '/cms-login'
  }

  return (
    <button 
      onClick={handleLogout} 
      className="flex items-center justify-center w-full gap-2 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition-colors"
    >
      <LogOut size={18} />
      Uitloggen om opnieuw in te loggen
    </button>
  )
}
