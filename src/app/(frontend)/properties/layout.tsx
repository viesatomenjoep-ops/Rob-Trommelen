import { cookies } from 'next/headers'
import PortfolioLogin from '@/components/frontend/PortfolioLogin'
import { createClient } from '@/lib/supabase/server'

export default async function PropertiesLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const access = cookieStore.get('portfolio_access')
  const isInvestor = cookieStore.get('investor_auth')?.value === 'true'
  
  let isAdmin = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isAdmin = !!user
  } catch (err) {
    console.error("Auth check failed in properties layout", err)
  }

  // Allow access if they have the portfolio password, or if they are an investor, or if they are an admin
  if (access?.value !== 'granted' && !isInvestor && !isAdmin) {
    return <PortfolioLogin />
  }

  return <>{children}</>
}
